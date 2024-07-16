import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILesson, NewLesson } from '../lesson.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILesson for edit and NewLessonFormGroupInput for create.
 */
type LessonFormGroupInput = ILesson | PartialWithRequiredKeyOf<NewLesson>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILesson | NewLesson> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type LessonFormRawValue = FormValueOf<ILesson>;

type NewLessonFormRawValue = FormValueOf<NewLesson>;

type LessonFormDefaults = Pick<NewLesson, 'id' | 'createdDate' | 'lastModifiedDate'>;

type LessonFormGroupContent = {
  id: FormControl<LessonFormRawValue['id'] | NewLesson['id']>;
  title: FormControl<LessonFormRawValue['title']>;
  content: FormControl<LessonFormRawValue['content']>;
  videoUrl: FormControl<LessonFormRawValue['videoUrl']>;
  createdBy: FormControl<LessonFormRawValue['createdBy']>;
  createdDate: FormControl<LessonFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<LessonFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<LessonFormRawValue['lastModifiedDate']>;
  module: FormControl<LessonFormRawValue['module']>;
};

export type LessonFormGroup = FormGroup<LessonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LessonFormService {
  createLessonFormGroup(lesson: LessonFormGroupInput = { id: null }): LessonFormGroup {
    const lessonRawValue = this.convertLessonToLessonRawValue({
      ...this.getFormDefaults(),
      ...lesson,
    });
    return new FormGroup<LessonFormGroupContent>({
      id: new FormControl(
        { value: lessonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(lessonRawValue.title, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      content: new FormControl(lessonRawValue.content),
      videoUrl: new FormControl(lessonRawValue.videoUrl),
      createdBy: new FormControl(lessonRawValue.createdBy),
      createdDate: new FormControl(lessonRawValue.createdDate),
      lastModifiedBy: new FormControl(lessonRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(lessonRawValue.lastModifiedDate),
      module: new FormControl(lessonRawValue.module),
    });
  }

  getLesson(form: LessonFormGroup): ILesson | NewLesson {
    return this.convertLessonRawValueToLesson(form.getRawValue() as LessonFormRawValue | NewLessonFormRawValue);
  }

  resetForm(form: LessonFormGroup, lesson: LessonFormGroupInput): void {
    const lessonRawValue = this.convertLessonToLessonRawValue({ ...this.getFormDefaults(), ...lesson });
    form.reset(
      {
        ...lessonRawValue,
        id: { value: lessonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LessonFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertLessonRawValueToLesson(rawLesson: LessonFormRawValue | NewLessonFormRawValue): ILesson | NewLesson {
    return {
      ...rawLesson,
      createdDate: dayjs(rawLesson.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawLesson.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertLessonToLessonRawValue(
    lesson: ILesson | (Partial<NewLesson> & LessonFormDefaults),
  ): LessonFormRawValue | PartialWithRequiredKeyOf<NewLessonFormRawValue> {
    return {
      ...lesson,
      createdDate: lesson.createdDate ? lesson.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: lesson.lastModifiedDate ? lesson.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
