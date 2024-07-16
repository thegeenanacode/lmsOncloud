import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';
import { GradebookService } from '../service/gradebook.service';
import { IGradebook } from '../gradebook.model';
import { GradebookFormService } from './gradebook-form.service';

import { GradebookUpdateComponent } from './gradebook-update.component';

describe('Gradebook Management Update Component', () => {
  let comp: GradebookUpdateComponent;
  let fixture: ComponentFixture<GradebookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gradebookFormService: GradebookFormService;
  let gradebookService: GradebookService;
  let appUserService: AppUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GradebookUpdateComponent],
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
      .overrideTemplate(GradebookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GradebookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gradebookFormService = TestBed.inject(GradebookFormService);
    gradebookService = TestBed.inject(GradebookService);
    appUserService = TestBed.inject(AppUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call student query and add missing value', () => {
      const gradebook: IGradebook = { id: 456 };
      const student: IAppUser = { id: 1322 };
      gradebook.student = student;

      const studentCollection: IAppUser[] = [{ id: 12940 }];
      jest.spyOn(appUserService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const expectedCollection: IAppUser[] = [student, ...studentCollection];
      jest.spyOn(appUserService, 'addAppUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gradebook });
      comp.ngOnInit();

      expect(appUserService.query).toHaveBeenCalled();
      expect(appUserService.addAppUserToCollectionIfMissing).toHaveBeenCalledWith(studentCollection, student);
      expect(comp.studentsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gradebook: IGradebook = { id: 456 };
      const student: IAppUser = { id: 20177 };
      gradebook.student = student;

      activatedRoute.data = of({ gradebook });
      comp.ngOnInit();

      expect(comp.studentsCollection).toContain(student);
      expect(comp.gradebook).toEqual(gradebook);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGradebook>>();
      const gradebook = { id: 123 };
      jest.spyOn(gradebookFormService, 'getGradebook').mockReturnValue(gradebook);
      jest.spyOn(gradebookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradebook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gradebook }));
      saveSubject.complete();

      // THEN
      expect(gradebookFormService.getGradebook).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gradebookService.update).toHaveBeenCalledWith(expect.objectContaining(gradebook));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGradebook>>();
      const gradebook = { id: 123 };
      jest.spyOn(gradebookFormService, 'getGradebook').mockReturnValue({ id: null });
      jest.spyOn(gradebookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradebook: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gradebook }));
      saveSubject.complete();

      // THEN
      expect(gradebookFormService.getGradebook).toHaveBeenCalled();
      expect(gradebookService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGradebook>>();
      const gradebook = { id: 123 };
      jest.spyOn(gradebookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradebook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gradebookService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppUser', () => {
      it('Should forward to appUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appUserService, 'compareAppUser');
        comp.compareAppUser(entity, entity2);
        expect(appUserService.compareAppUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
