import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEnrollment } from 'app/entities/enrollment/enrollment.model';
import { EnrollmentService } from 'app/entities/enrollment/service/enrollment.service';
import { UserRole } from 'app/entities/enumerations/user-role.model';
import { AppUserService } from '../service/app-user.service';
import { IAppUser } from '../app-user.model';
import { AppUserFormService, AppUserFormGroup } from './app-user-form.service';

@Component({
  standalone: true,
  selector: 'jhi-app-user-update',
  templateUrl: './app-user-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AppUserUpdateComponent implements OnInit {
  isSaving = false;
  appUser: IAppUser | null = null;
  userRoleValues = Object.keys(UserRole);

  enrollmentsCollection: IEnrollment[] = [];

  protected appUserService = inject(AppUserService);
  protected appUserFormService = inject(AppUserFormService);
  protected enrollmentService = inject(EnrollmentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AppUserFormGroup = this.appUserFormService.createAppUserFormGroup();

  compareEnrollment = (o1: IEnrollment | null, o2: IEnrollment | null): boolean => this.enrollmentService.compareEnrollment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.appUser = appUser;
      if (appUser) {
        this.updateForm(appUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appUser = this.appUserFormService.getAppUser(this.editForm);
    if (appUser.id !== null) {
      this.subscribeToSaveResponse(this.appUserService.update(appUser));
    } else {
      this.subscribeToSaveResponse(this.appUserService.create(appUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppUser>>): void {
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

  protected updateForm(appUser: IAppUser): void {
    this.appUser = appUser;
    this.appUserFormService.resetForm(this.editForm, appUser);

    this.enrollmentsCollection = this.enrollmentService.addEnrollmentToCollectionIfMissing<IEnrollment>(
      this.enrollmentsCollection,
      appUser.enrollment,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enrollmentService
      .query({ filter: 'appuser-is-null' })
      .pipe(map((res: HttpResponse<IEnrollment[]>) => res.body ?? []))
      .pipe(
        map((enrollments: IEnrollment[]) =>
          this.enrollmentService.addEnrollmentToCollectionIfMissing<IEnrollment>(enrollments, this.appUser?.enrollment),
        ),
      )
      .subscribe((enrollments: IEnrollment[]) => (this.enrollmentsCollection = enrollments));
  }
}
