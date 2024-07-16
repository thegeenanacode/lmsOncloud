import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lesson.test-samples';

import { LessonFormService } from './lesson-form.service';

describe('Lesson Form Service', () => {
  let service: LessonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonFormService);
  });

  describe('Service methods', () => {
    describe('createLessonFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLessonFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            videoUrl: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            module: expect.any(Object),
          }),
        );
      });

      it('passing ILesson should create a new form with FormGroup', () => {
        const formGroup = service.createLessonFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            videoUrl: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            module: expect.any(Object),
          }),
        );
      });
    });

    describe('getLesson', () => {
      it('should return NewLesson for default Lesson initial value', () => {
        const formGroup = service.createLessonFormGroup(sampleWithNewData);

        const lesson = service.getLesson(formGroup) as any;

        expect(lesson).toMatchObject(sampleWithNewData);
      });

      it('should return NewLesson for empty Lesson initial value', () => {
        const formGroup = service.createLessonFormGroup();

        const lesson = service.getLesson(formGroup) as any;

        expect(lesson).toMatchObject({});
      });

      it('should return ILesson', () => {
        const formGroup = service.createLessonFormGroup(sampleWithRequiredData);

        const lesson = service.getLesson(formGroup) as any;

        expect(lesson).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILesson should not enable id FormControl', () => {
        const formGroup = service.createLessonFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLesson should disable id FormControl', () => {
        const formGroup = service.createLessonFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
