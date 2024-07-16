import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { AssignmentService } from '../service/assignment.service';
import { IAssignment } from '../assignment.model';
import { AssignmentFormService, AssignmentFormGroup } from './assignment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-assignment-update',
  templateUrl: './assignment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AssignmentUpdateComponent implements OnInit {
  isSaving = false;
  assignment: IAssignment | null = null;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected assignmentService = inject(AssignmentService);
  protected assignmentFormService = inject(AssignmentFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AssignmentFormGroup = this.assignmentFormService.createAssignmentFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assignment }) => {
      this.assignment = assignment;
      if (assignment) {
        this.updateForm(assignment);
      }
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
    const assignment = this.assignmentFormService.getAssignment(this.editForm);
    if (assignment.id !== null) {
      this.subscribeToSaveResponse(this.assignmentService.update(assignment));
    } else {
      this.subscribeToSaveResponse(this.assignmentService.create(assignment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssignment>>): void {
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

  protected updateForm(assignment: IAssignment): void {
    this.assignment = assignment;
    this.assignmentFormService.resetForm(this.editForm, assignment);
  }
}
