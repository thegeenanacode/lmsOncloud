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
import { ResourceType } from 'app/entities/enumerations/resource-type.model';
import { ContentLibraryService } from '../service/content-library.service';
import { IContentLibrary } from '../content-library.model';
import { ContentLibraryFormService, ContentLibraryFormGroup } from './content-library-form.service';

@Component({
  standalone: true,
  selector: 'jhi-content-library-update',
  templateUrl: './content-library-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ContentLibraryUpdateComponent implements OnInit {
  isSaving = false;
  contentLibrary: IContentLibrary | null = null;
  resourceTypeValues = Object.keys(ResourceType);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected contentLibraryService = inject(ContentLibraryService);
  protected contentLibraryFormService = inject(ContentLibraryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ContentLibraryFormGroup = this.contentLibraryFormService.createContentLibraryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contentLibrary }) => {
      this.contentLibrary = contentLibrary;
      if (contentLibrary) {
        this.updateForm(contentLibrary);
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
    const contentLibrary = this.contentLibraryFormService.getContentLibrary(this.editForm);
    if (contentLibrary.id !== null) {
      this.subscribeToSaveResponse(this.contentLibraryService.update(contentLibrary));
    } else {
      this.subscribeToSaveResponse(this.contentLibraryService.create(contentLibrary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContentLibrary>>): void {
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

  protected updateForm(contentLibrary: IContentLibrary): void {
    this.contentLibrary = contentLibrary;
    this.contentLibraryFormService.resetForm(this.editForm, contentLibrary);
  }
}
