import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEnrollment, NewEnrollment } from '../enrollment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEnrollment for edit and NewEnrollmentFormGroupInput for create.
 */
type EnrollmentFormGroupInput = IEnrollment | PartialWithRequiredKeyOf<NewEnrollment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEnrollment | NewEnrollment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EnrollmentFormRawValue = FormValueOf<IEnrollment>;

type NewEnrollmentFormRawValue = FormValueOf<NewEnrollment>;

type EnrollmentFormDefaults = Pick<NewEnrollment, 'id' | 'createdDate' | 'lastModifiedDate'>;

type EnrollmentFormGroupContent = {
  id: FormControl<EnrollmentFormRawValue['id'] | NewEnrollment['id']>;
  enrollmentDate: FormControl<EnrollmentFormRawValue['enrollmentDate']>;
  status: FormControl<EnrollmentFormRawValue['status']>;
  createdBy: FormControl<EnrollmentFormRawValue['createdBy']>;
  createdDate: FormControl<EnrollmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EnrollmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EnrollmentFormRawValue['lastModifiedDate']>;
  user: FormControl<EnrollmentFormRawValue['user']>;
  course: FormControl<EnrollmentFormRawValue['course']>;
};

export type EnrollmentFormGroup = FormGroup<EnrollmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnrollmentFormService {
  createEnrollmentFormGroup(enrollment: EnrollmentFormGroupInput = { id: null }): EnrollmentFormGroup {
    const enrollmentRawValue = this.convertEnrollmentToEnrollmentRawValue({
      ...this.getFormDefaults(),
      ...enrollment,
    });
    return new FormGroup<EnrollmentFormGroupContent>({
      id: new FormControl(
        { value: enrollmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      enrollmentDate: new FormControl(enrollmentRawValue.enrollmentDate),
      status: new FormControl(enrollmentRawValue.status),
      createdBy: new FormControl(enrollmentRawValue.createdBy),
      createdDate: new FormControl(enrollmentRawValue.createdDate),
      lastModifiedBy: new FormControl(enrollmentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(enrollmentRawValue.lastModifiedDate),
      user: new FormControl(enrollmentRawValue.user),
      course: new FormControl(enrollmentRawValue.course),
    });
  }

  getEnrollment(form: EnrollmentFormGroup): IEnrollment | NewEnrollment {
    return this.convertEnrollmentRawValueToEnrollment(form.getRawValue() as EnrollmentFormRawValue | NewEnrollmentFormRawValue);
  }

  resetForm(form: EnrollmentFormGroup, enrollment: EnrollmentFormGroupInput): void {
    const enrollmentRawValue = this.convertEnrollmentToEnrollmentRawValue({ ...this.getFormDefaults(), ...enrollment });
    form.reset(
      {
        ...enrollmentRawValue,
        id: { value: enrollmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EnrollmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEnrollmentRawValueToEnrollment(
    rawEnrollment: EnrollmentFormRawValue | NewEnrollmentFormRawValue,
  ): IEnrollment | NewEnrollment {
    return {
      ...rawEnrollment,
      createdDate: dayjs(rawEnrollment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEnrollment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEnrollmentToEnrollmentRawValue(
    enrollment: IEnrollment | (Partial<NewEnrollment> & EnrollmentFormDefaults),
  ): EnrollmentFormRawValue | PartialWithRequiredKeyOf<NewEnrollmentFormRawValue> {
    return {
      ...enrollment,
      createdDate: enrollment.createdDate ? enrollment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: enrollment.lastModifiedDate ? enrollment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
