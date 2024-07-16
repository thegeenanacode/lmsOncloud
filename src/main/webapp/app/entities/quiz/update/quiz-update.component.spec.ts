import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { QuizService } from '../service/quiz.service';
import { IQuiz } from '../quiz.model';
import { QuizFormService } from './quiz-form.service';

import { QuizUpdateComponent } from './quiz-update.component';

describe('Quiz Management Update Component', () => {
  let comp: QuizUpdateComponent;
  let fixture: ComponentFixture<QuizUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let quizFormService: QuizFormService;
  let quizService: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuizUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(QuizUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuizUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    quizFormService = TestBed.inject(QuizFormService);
    quizService = TestBed.inject(QuizService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const quiz: IQuiz = { id: 456 };

      activatedRoute.data = of({ quiz });
      comp.ngOnInit();

      expect(comp.quiz).toEqual(quiz);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuiz>>();
      const quiz = { id: 123 };
      jest.spyOn(quizFormService, 'getQuiz').mockReturnValue(quiz);
      jest.spyOn(quizService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ quiz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: quiz }));
      saveSubject.complete();

      // THEN
      expect(quizFormService.getQuiz).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(quizService.update).toHaveBeenCalledWith(expect.objectContaining(quiz));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuiz>>();
      const quiz = { id: 123 };
      jest.spyOn(quizFormService, 'getQuiz').mockReturnValue({ id: null });
      jest.spyOn(quizService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ quiz: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: quiz }));
      saveSubject.complete();

      // THEN
      expect(quizFormService.getQuiz).toHaveBeenCalled();
      expect(quizService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuiz>>();
      const quiz = { id: 123 };
      jest.spyOn(quizService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ quiz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(quizService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
