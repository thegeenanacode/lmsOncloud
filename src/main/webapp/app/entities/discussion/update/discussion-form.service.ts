import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDiscussion, NewDiscussion } from '../discussion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiscussion for edit and NewDiscussionFormGroupInput for create.
 */
type DiscussionFormGroupInput = IDiscussion | PartialWithRequiredKeyOf<NewDiscussion>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDiscussion | NewDiscussion> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type DiscussionFormRawValue = FormValueOf<IDiscussion>;

type NewDiscussionFormRawValue = FormValueOf<NewDiscussion>;

type DiscussionFormDefaults = Pick<NewDiscussion, 'id' | 'createdDate' | 'lastModifiedDate'>;

type DiscussionFormGroupContent = {
  id: FormControl<DiscussionFormRawValue['id'] | NewDiscussion['id']>;
  topic: FormControl<DiscussionFormRawValue['topic']>;
  details: FormControl<DiscussionFormRawValue['details']>;
  createdBy: FormControl<DiscussionFormRawValue['createdBy']>;
  createdDate: FormControl<DiscussionFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<DiscussionFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<DiscussionFormRawValue['lastModifiedDate']>;
  course: FormControl<DiscussionFormRawValue['course']>;
};

export type DiscussionFormGroup = FormGroup<DiscussionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiscussionFormService {
  createDiscussionFormGroup(discussion: DiscussionFormGroupInput = { id: null }): DiscussionFormGroup {
    const discussionRawValue = this.convertDiscussionToDiscussionRawValue({
      ...this.getFormDefaults(),
      ...discussion,
    });
    return new FormGroup<DiscussionFormGroupContent>({
      id: new FormControl(
        { value: discussionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      topic: new FormControl(discussionRawValue.topic, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      details: new FormControl(discussionRawValue.details, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(discussionRawValue.createdBy),
      createdDate: new FormControl(discussionRawValue.createdDate),
      lastModifiedBy: new FormControl(discussionRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(discussionRawValue.lastModifiedDate),
      course: new FormControl(discussionRawValue.course),
    });
  }

  getDiscussion(form: DiscussionFormGroup): IDiscussion | NewDiscussion {
    return this.convertDiscussionRawValueToDiscussion(form.getRawValue() as DiscussionFormRawValue | NewDiscussionFormRawValue);
  }

  resetForm(form: DiscussionFormGroup, discussion: DiscussionFormGroupInput): void {
    const discussionRawValue = this.convertDiscussionToDiscussionRawValue({ ...this.getFormDefaults(), ...discussion });
    form.reset(
      {
        ...discussionRawValue,
        id: { value: discussionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DiscussionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertDiscussionRawValueToDiscussion(
    rawDiscussion: DiscussionFormRawValue | NewDiscussionFormRawValue,
  ): IDiscussion | NewDiscussion {
    return {
      ...rawDiscussion,
      createdDate: dayjs(rawDiscussion.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawDiscussion.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertDiscussionToDiscussionRawValue(
    discussion: IDiscussion | (Partial<NewDiscussion> & DiscussionFormDefaults),
  ): DiscussionFormRawValue | PartialWithRequiredKeyOf<NewDiscussionFormRawValue> {
    return {
      ...discussion,
      createdDate: discussion.createdDate ? discussion.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: discussion.lastModifiedDate ? discussion.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
