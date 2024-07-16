import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { GradebookService } from '../service/gradebook.service';
import { IGradebook } from '../gradebook.model';
import { GradebookFormService, GradebookFormGroup } from './gradebook-form.service';

@Component({
  standalone: true,
  selector: 'jhi-gradebook-update',
  templateUrl: './gradebook-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GradebookUpdateComponent implements OnInit {
  isSaving = false;
  gradebook: IGradebook | null = null;
  gradeTypeValues = Object.keys(GradeType);

  studentsCollection: IAppUser[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected gradebookService = inject(GradebookService);
  protected gradebookFormService = inject(GradebookFormService);
  protected appUserService = inject(AppUserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GradebookFormGroup = this.gradebookFormService.createGradebookFormGroup();

  compareAppUser = (o1: IAppUser | null, o2: IAppUser | null): boolean => this.appUserService.compareAppUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gradebook }) => {
      this.gradebook = gradebook;
      if (gradebook) {
        this.updateForm(gradebook);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('lmsOnCloudApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gradebook = this.gradebookFormService.getGradebook(this.editForm);
    if (gradebook.id !== null) {
      this.subscribeToSaveResponse(this.gradebookService.update(gradebook));
    } else {
      this.subscribeToSaveResponse(this.gradebookService.create(gradebook));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGradebook>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(gradebook: IGradebook): void {
    this.gradebook = gradebook;
    this.gradebookFormService.resetForm(this.editForm, gradebook);

    this.studentsCollection = this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(this.studentsCollection, gradebook.student);
  }

  protected loadRelationshipsOptions(): void {
    this.appUserService
      .query({ filter: 'gradebook-is-null' })
      .pipe(map((res: HttpResponse<IAppUser[]>) => res.body ?? []))
      .pipe(map((appUsers: IAppUser[]) => this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(appUsers, this.gradebook?.student)))
      .subscribe((appUsers: IAppUser[]) => (this.studentsCollection = appUsers));
  }
}
