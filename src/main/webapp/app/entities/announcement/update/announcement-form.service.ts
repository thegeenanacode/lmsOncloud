import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAnnouncement, NewAnnouncement } from '../announcement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnnouncement for edit and NewAnnouncementFormGroupInput for create.
 */
type AnnouncementFormGroupInput = IAnnouncement | PartialWithRequiredKeyOf<NewAnnouncement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAnnouncement | NewAnnouncement> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AnnouncementFormRawValue = FormValueOf<IAnnouncement>;

type NewAnnouncementFormRawValue = FormValueOf<NewAnnouncement>;

type AnnouncementFormDefaults = Pick<NewAnnouncement, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AnnouncementFormGroupContent = {
  id: FormControl<AnnouncementFormRawValue['id'] | NewAnnouncement['id']>;
  title: FormControl<AnnouncementFormRawValue['title']>;
  content: FormControl<AnnouncementFormRawValue['content']>;
  publishDate: FormControl<AnnouncementFormRawValue['publishDate']>;
  createdBy: FormControl<AnnouncementFormRawValue['createdBy']>;
  createdDate: FormControl<AnnouncementFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AnnouncementFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AnnouncementFormRawValue['lastModifiedDate']>;
};

export type AnnouncementFormGroup = FormGroup<AnnouncementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnnouncementFormService {
  createAnnouncementFormGroup(announcement: AnnouncementFormGroupInput = { id: null }): AnnouncementFormGroup {
    const announcementRawValue = this.convertAnnouncementToAnnouncementRawValue({
      ...this.getFormDefaults(),
      ...announcement,
    });
    return new FormGroup<AnnouncementFormGroupContent>({
      id: new FormControl(
        { value: announcementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(announcementRawValue.title, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      content: new FormControl(announcementRawValue.content, {
        validators: [Validators.required],
      }),
      publishDate: new FormControl(announcementRawValue.publishDate, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(announcementRawValue.createdBy),
      createdDate: new FormControl(announcementRawValue.createdDate),
      lastModifiedBy: new FormControl(announcementRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(announcementRawValue.lastModifiedDate),
    });
  }

  getAnnouncement(form: AnnouncementFormGroup): IAnnouncement | NewAnnouncement {
    return this.convertAnnouncementRawValueToAnnouncement(form.getRawValue() as AnnouncementFormRawValue | NewAnnouncementFormRawValue);
  }

  resetForm(form: AnnouncementFormGroup, announcement: AnnouncementFormGroupInput): void {
    const announcementRawValue = this.convertAnnouncementToAnnouncementRawValue({ ...this.getFormDefaults(), ...announcement });
    form.reset(
      {
        ...announcementRawValue,
        id: { value: announcementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AnnouncementFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAnnouncementRawValueToAnnouncement(
    rawAnnouncement: AnnouncementFormRawValue | NewAnnouncementFormRawValue,
  ): IAnnouncement | NewAnnouncement {
    return {
      ...rawAnnouncement,
      createdDate: dayjs(rawAnnouncement.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAnnouncement.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAnnouncementToAnnouncementRawValue(
    announcement: IAnnouncement | (Partial<NewAnnouncement> & AnnouncementFormDefaults),
  ): AnnouncementFormRawValue | PartialWithRequiredKeyOf<NewAnnouncementFormRawValue> {
    return {
      ...announcement,
      createdDate: announcement.createdDate ? announcement.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: announcement.lastModifiedDate ? announcement.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
