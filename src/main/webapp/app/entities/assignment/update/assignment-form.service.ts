import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAssignment, NewAssignment } from '../assignment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAssignment for edit and NewAssignmentFormGroupInput for create.
 */
type AssignmentFormGroupInput = IAssignment | PartialWithRequiredKeyOf<NewAssignment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAssignment | NewAssignment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AssignmentFormRawValue = FormValueOf<IAssignment>;

type NewAssignmentFormRawValue = FormValueOf<NewAssignment>;

type AssignmentFormDefaults = Pick<NewAssignment, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AssignmentFormGroupContent = {
  id: FormControl<AssignmentFormRawValue['id'] | NewAssignment['id']>;
  name: FormControl<AssignmentFormRawValue['name']>;
  description: FormControl<AssignmentFormRawValue['description']>;
  dueDate: FormControl<AssignmentFormRawValue['dueDate']>;
  createdBy: FormControl<AssignmentFormRawValue['createdBy']>;
  createdDate: FormControl<AssignmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AssignmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AssignmentFormRawValue['lastModifiedDate']>;
};

export type AssignmentFormGroup = FormGroup<AssignmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssignmentFormService {
  createAssignmentFormGroup(assignment: AssignmentFormGroupInput = { id: null }): AssignmentFormGroup {
    const assignmentRawValue = this.convertAssignmentToAssignmentRawValue({
      ...this.getFormDefaults(),
      ...assignment,
    });
    return new FormGroup<AssignmentFormGroupContent>({
      id: new FormControl(
        { value: assignmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(assignmentRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: new FormControl(assignmentRawValue.description),
      dueDate: new FormControl(assignmentRawValue.dueDate),
      createdBy: new FormControl(assignmentRawValue.createdBy),
      createdDate: new FormControl(assignmentRawValue.createdDate),
      lastModifiedBy: new FormControl(assignmentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(assignmentRawValue.lastModifiedDate),
    });
  }

  getAssignment(form: AssignmentFormGroup): IAssignment | NewAssignment {
    return this.convertAssignmentRawValueToAssignment(form.getRawValue() as AssignmentFormRawValue | NewAssignmentFormRawValue);
  }

  resetForm(form: AssignmentFormGroup, assignment: AssignmentFormGroupInput): void {
    const assignmentRawValue = this.convertAssignmentToAssignmentRawValue({ ...this.getFormDefaults(), ...assignment });
    form.reset(
      {
        ...assignmentRawValue,
        id: { value: assignmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AssignmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAssignmentRawValueToAssignment(
    rawAssignment: AssignmentFormRawValue | NewAssignmentFormRawValue,
  ): IAssignment | NewAssignment {
    return {
      ...rawAssignment,
      createdDate: dayjs(rawAssignment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAssignment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAssignmentToAssignmentRawValue(
    assignment: IAssignment | (Partial<NewAssignment> & AssignmentFormDefaults),
  ): AssignmentFormRawValue | PartialWithRequiredKeyOf<NewAssignmentFormRawValue> {
    return {
      ...assignment,
      createdDate: assignment.createdDate ? assignment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: assignment.lastModifiedDate ? assignment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
