import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { ModuleService } from '../service/module.service';
import { IModule } from '../module.model';
import { ModuleFormService } from './module-form.service';

import { ModuleUpdateComponent } from './module-update.component';

describe('Module Management Update Component', () => {
  let comp: ModuleUpdateComponent;
  let fixture: ComponentFixture<ModuleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moduleFormService: ModuleFormService;
  let moduleService: ModuleService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModuleUpdateComponent],
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
      .overrideTemplate(ModuleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModuleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moduleFormService = TestBed.inject(ModuleFormService);
    moduleService = TestBed.inject(ModuleService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Course query and add missing value', () => {
      const module: IModule = { id: 456 };
      const courses: ICourse[] = [{ id: 7136 }];
      module.courses = courses;

      const courseCollection: ICourse[] = [{ id: 20247 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [...courses];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ module });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(expect.objectContaining),
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const module: IModule = { id: 456 };
      const course: ICourse = { id: 31945 };
      module.courses = [course];

      activatedRoute.data = of({ module });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection).toContain(course);
      expect(comp.module).toEqual(module);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModule>>();
      const module = { id: 123 };
      jest.spyOn(moduleFormService, 'getModule').mockReturnValue(module);
      jest.spyOn(moduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ module });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: module }));
      saveSubject.complete();

      // THEN
      expect(moduleFormService.getModule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moduleService.update).toHaveBeenCalledWith(expect.objectContaining(module));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModule>>();
      const module = { id: 123 };
      jest.spyOn(moduleFormService, 'getModule').mockReturnValue({ id: null });
      jest.spyOn(moduleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ module: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: module }));
      saveSubject.complete();

      // THEN
      expect(moduleFormService.getModule).toHaveBeenCalled();
      expect(moduleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModule>>();
      const module = { id: 123 };
      jest.spyOn(moduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ module });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moduleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCourse', () => {
      it('Should forward to courseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(courseService, 'compareCourse');
        comp.compareCourse(entity, entity2);
        expect(courseService.compareCourse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
