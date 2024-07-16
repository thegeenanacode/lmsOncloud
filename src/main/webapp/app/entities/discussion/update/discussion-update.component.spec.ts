import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { DiscussionService } from '../service/discussion.service';
import { IDiscussion } from '../discussion.model';
import { DiscussionFormService } from './discussion-form.service';

import { DiscussionUpdateComponent } from './discussion-update.component';

describe('Discussion Management Update Component', () => {
  let comp: DiscussionUpdateComponent;
  let fixture: ComponentFixture<DiscussionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let discussionFormService: DiscussionFormService;
  let discussionService: DiscussionService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DiscussionUpdateComponent],
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
      .overrideTemplate(DiscussionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscussionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    discussionFormService = TestBed.inject(DiscussionFormService);
    discussionService = TestBed.inject(DiscussionService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Course query and add missing value', () => {
      const discussion: IDiscussion = { id: 456 };
      const course: ICourse = { id: 16946 };
      discussion.course = course;

      const courseCollection: ICourse[] = [{ id: 22270 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [course];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ discussion });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(expect.objectContaining),
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const discussion: IDiscussion = { id: 456 };
      const course: ICourse = { id: 3157 };
      discussion.course = course;

      activatedRoute.data = of({ discussion });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection).toContain(course);
      expect(comp.discussion).toEqual(discussion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscussion>>();
      const discussion = { id: 123 };
      jest.spyOn(discussionFormService, 'getDiscussion').mockReturnValue(discussion);
      jest.spyOn(discussionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discussion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discussion }));
      saveSubject.complete();

      // THEN
      expect(discussionFormService.getDiscussion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(discussionService.update).toHaveBeenCalledWith(expect.objectContaining(discussion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscussion>>();
      const discussion = { id: 123 };
      jest.spyOn(discussionFormService, 'getDiscussion').mockReturnValue({ id: null });
      jest.spyOn(discussionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discussion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discussion }));
      saveSubject.complete();

      // THEN
      expect(discussionFormService.getDiscussion).toHaveBeenCalled();
      expect(discussionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscussion>>();
      const discussion = { id: 123 };
      jest.spyOn(discussionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discussion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(discussionService.update).toHaveBeenCalled();
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
