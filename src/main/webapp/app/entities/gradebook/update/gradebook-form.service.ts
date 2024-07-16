import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGradebook, NewGradebook } from '../gradebook.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGradebook for edit and NewGradebookFormGroupInput for create.
 */
type GradebookFormGroupInput = IGradebook | PartialWithRequiredKeyOf<NewGradebook>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGradebook | NewGradebook> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type GradebookFormRawValue = FormValueOf<IGradebook>;

type NewGradebookFormRawValue = FormValueOf<NewGradebook>;

type GradebookFormDefaults = Pick<NewGradebook, 'id' | 'createdDate' | 'lastModifiedDate'>;

type GradebookFormGroupContent = {
  id: FormControl<GradebookFormRawValue['id'] | NewGradebook['id']>;
  gradeType: FormControl<GradebookFormRawValue['gradeType']>;
  gradeValue: FormControl<GradebookFormRawValue['gradeValue']>;
  comments: FormControl<GradebookFormRawValue['comments']>;
  createdBy: FormControl<GradebookFormRawValue['createdBy']>;
  createdDate: FormControl<GradebookFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<GradebookFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<GradebookFormRawValue['lastModifiedDate']>;
  student: FormControl<GradebookFormRawValue['student']>;
};

export type GradebookFormGroup = FormGroup<GradebookFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GradebookFormService {
  createGradebookFormGroup(gradebook: GradebookFormGroupInput = { id: null }): GradebookFormGroup {
    const gradebookRawValue = this.convertGradebookToGradebookRawValue({
      ...this.getFormDefaults(),
      ...gradebook,
    });
    return new FormGroup<GradebookFormGroupContent>({
      id: new FormControl(
        { value: gradebookRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      gradeType: new FormControl(gradebookRawValue.gradeType),
      gradeValue: new FormControl(gradebookRawValue.gradeValue, {
        validators: [Validators.maxLength(10)],
      }),
      comments: new FormControl(gradebookRawValue.comments),
      createdBy: new FormControl(gradebookRawValue.createdBy),
      createdDate: new FormControl(gradebookRawValue.createdDate),
      lastModifiedBy: new FormControl(gradebookRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(gradebookRawValue.lastModifiedDate),
      student: new FormControl(gradebookRawValue.student),
    });
  }

  getGradebook(form: GradebookFormGroup): IGradebook | NewGradebook {
    return this.convertGradebookRawValueToGradebook(form.getRawValue() as GradebookFormRawValue | NewGradebookFormRawValue);
  }

  resetForm(form: GradebookFormGroup, gradebook: GradebookFormGroupInput): void {
    const gradebookRawValue = this.convertGradebookToGradebookRawValue({ ...this.getFormDefaults(), ...gradebook });
    form.reset(
      {
        ...gradebookRawValue,
        id: { value: gradebookRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GradebookFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertGradebookRawValueToGradebook(rawGradebook: GradebookFormRawValue | NewGradebookFormRawValue): IGradebook | NewGradebook {
    return {
      ...rawGradebook,
      createdDate: dayjs(rawGradebook.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawGradebook.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertGradebookToGradebookRawValue(
    gradebook: IGradebook | (Partial<NewGradebook> & GradebookFormDefaults),
  ): GradebookFormRawValue | PartialWithRequiredKeyOf<NewGradebookFormRawValue> {
    return {
      ...gradebook,
      createdDate: gradebook.createdDate ? gradebook.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: gradebook.lastModifiedDate ? gradebook.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
