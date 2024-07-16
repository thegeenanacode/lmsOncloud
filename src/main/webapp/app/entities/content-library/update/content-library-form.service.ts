import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IContentLibrary, NewContentLibrary } from '../content-library.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContentLibrary for edit and NewContentLibraryFormGroupInput for create.
 */
type ContentLibraryFormGroupInput = IContentLibrary | PartialWithRequiredKeyOf<NewContentLibrary>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IContentLibrary | NewContentLibrary> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ContentLibraryFormRawValue = FormValueOf<IContentLibrary>;

type NewContentLibraryFormRawValue = FormValueOf<NewContentLibrary>;

type ContentLibraryFormDefaults = Pick<NewContentLibrary, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ContentLibraryFormGroupContent = {
  id: FormControl<ContentLibraryFormRawValue['id'] | NewContentLibrary['id']>;
  name: FormControl<ContentLibraryFormRawValue['name']>;
  description: FormControl<ContentLibraryFormRawValue['description']>;
  resourceType: FormControl<ContentLibraryFormRawValue['resourceType']>;
  createdBy: FormControl<ContentLibraryFormRawValue['createdBy']>;
  createdDate: FormControl<ContentLibraryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ContentLibraryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ContentLibraryFormRawValue['lastModifiedDate']>;
};

export type ContentLibraryFormGroup = FormGroup<ContentLibraryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContentLibraryFormService {
  createContentLibraryFormGroup(contentLibrary: ContentLibraryFormGroupInput = { id: null }): ContentLibraryFormGroup {
    const contentLibraryRawValue = this.convertContentLibraryToContentLibraryRawValue({
      ...this.getFormDefaults(),
      ...contentLibrary,
    });
    return new FormGroup<ContentLibraryFormGroupContent>({
      id: new FormControl(
        { value: contentLibraryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(contentLibraryRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: new FormControl(contentLibraryRawValue.description),
      resourceType: new FormControl(contentLibraryRawValue.resourceType),
      createdBy: new FormControl(contentLibraryRawValue.createdBy),
      createdDate: new FormControl(contentLibraryRawValue.createdDate),
      lastModifiedBy: new FormControl(contentLibraryRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(contentLibraryRawValue.lastModifiedDate),
    });
  }

  getContentLibrary(form: ContentLibraryFormGroup): IContentLibrary | NewContentLibrary {
    return this.convertContentLibraryRawValueToContentLibrary(
      form.getRawValue() as ContentLibraryFormRawValue | NewContentLibraryFormRawValue,
    );
  }

  resetForm(form: ContentLibraryFormGroup, contentLibrary: ContentLibraryFormGroupInput): void {
    const contentLibraryRawValue = this.convertContentLibraryToContentLibraryRawValue({ ...this.getFormDefaults(), ...contentLibrary });
    form.reset(
      {
        ...contentLibraryRawValue,
        id: { value: contentLibraryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ContentLibraryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertContentLibraryRawValueToContentLibrary(
    rawContentLibrary: ContentLibraryFormRawValue | NewContentLibraryFormRawValue,
  ): IContentLibrary | NewContentLibrary {
    return {
      ...rawContentLibrary,
      createdDate: dayjs(rawContentLibrary.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawContentLibrary.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertContentLibraryToContentLibraryRawValue(
    contentLibrary: IContentLibrary | (Partial<NewContentLibrary> & ContentLibraryFormDefaults),
  ): ContentLibraryFormRawValue | PartialWithRequiredKeyOf<NewContentLibraryFormRawValue> {
    return {
      ...contentLibrary,
      createdDate: contentLibrary.createdDate ? contentLibrary.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: contentLibrary.lastModifiedDate ? contentLibrary.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
