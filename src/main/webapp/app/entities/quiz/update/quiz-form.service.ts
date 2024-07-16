import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IQuiz, NewQuiz } from '../quiz.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IQuiz for edit and NewQuizFormGroupInput for create.
 */
type QuizFormGroupInput = IQuiz | PartialWithRequiredKeyOf<NewQuiz>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IQuiz | NewQuiz> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type QuizFormRawValue = FormValueOf<IQuiz>;

type NewQuizFormRawValue = FormValueOf<NewQuiz>;

type QuizFormDefaults = Pick<NewQuiz, 'id' | 'createdDate' | 'lastModifiedDate'>;

type QuizFormGroupContent = {
  id: FormControl<QuizFormRawValue['id'] | NewQuiz['id']>;
  title: FormControl<QuizFormRawValue['title']>;
  description: FormControl<QuizFormRawValue['description']>;
  createdBy: FormControl<QuizFormRawValue['createdBy']>;
  createdDate: FormControl<QuizFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<QuizFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<QuizFormRawValue['lastModifiedDate']>;
};

export type QuizFormGroup = FormGroup<QuizFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class QuizFormService {
  createQuizFormGroup(quiz: QuizFormGroupInput = { id: null }): QuizFormGroup {
    const quizRawValue = this.convertQuizToQuizRawValue({
      ...this.getFormDefaults(),
      ...quiz,
    });
    return new FormGroup<QuizFormGroupContent>({
      id: new FormControl(
        { value: quizRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(quizRawValue.title, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: new FormControl(quizRawValue.description),
      createdBy: new FormControl(quizRawValue.createdBy),
      createdDate: new FormControl(quizRawValue.createdDate),
      lastModifiedBy: new FormControl(quizRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(quizRawValue.lastModifiedDate),
    });
  }

  getQuiz(form: QuizFormGroup): IQuiz | NewQuiz {
    return this.convertQuizRawValueToQuiz(form.getRawValue() as QuizFormRawValue | NewQuizFormRawValue);
  }

  resetForm(form: QuizFormGroup, quiz: QuizFormGroupInput): void {
    const quizRawValue = this.convertQuizToQuizRawValue({ ...this.getFormDefaults(), ...quiz });
    form.reset(
      {
        ...quizRawValue,
        id: { value: quizRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): QuizFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertQuizRawValueToQuiz(rawQuiz: QuizFormRawValue | NewQuizFormRawValue): IQuiz | NewQuiz {
    return {
      ...rawQuiz,
      createdDate: dayjs(rawQuiz.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawQuiz.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertQuizToQuizRawValue(
    quiz: IQuiz | (Partial<NewQuiz> & QuizFormDefaults),
  ): QuizFormRawValue | PartialWithRequiredKeyOf<NewQuizFormRawValue> {
    return {
      ...quiz,
      createdDate: quiz.createdDate ? quiz.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: quiz.lastModifiedDate ? quiz.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
