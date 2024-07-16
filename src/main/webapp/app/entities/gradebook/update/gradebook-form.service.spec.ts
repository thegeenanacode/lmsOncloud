import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../gradebook.test-samples';

import { GradebookFormService } from './gradebook-form.service';

describe('Gradebook Form Service', () => {
  let service: GradebookFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradebookFormService);
  });

  describe('Service methods', () => {
    describe('createGradebookFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGradebookFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gradeType: expect.any(Object),
            gradeValue: expect.any(Object),
            comments: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            student: expect.any(Object),
          }),
        );
      });

      it('passing IGradebook should create a new form with FormGroup', () => {
        const formGroup = service.createGradebookFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gradeType: expect.any(Object),
            gradeValue: expect.any(Object),
            comments: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            student: expect.any(Object),
          }),
        );
      });
    });

    describe('getGradebook', () => {
      it('should return NewGradebook for default Gradebook initial value', () => {
        const formGroup = service.createGradebookFormGroup(sampleWithNewData);

        const gradebook = service.getGradebook(formGroup) as any;

        expect(gradebook).toMatchObject(sampleWithNewData);
      });

      it('should return NewGradebook for empty Gradebook initial value', () => {
        const formGroup = service.createGradebookFormGroup();

        const gradebook = service.getGradebook(formGroup) as any;

        expect(gradebook).toMatchObject({});
      });

      it('should return IGradebook', () => {
        const formGroup = service.createGradebookFormGroup(sampleWithRequiredData);

        const gradebook = service.getGradebook(formGroup) as any;

        expect(gradebook).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGradebook should not enable id FormControl', () => {
        const formGroup = service.createGradebookFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGradebook should disable id FormControl', () => {
        const formGroup = service.createGradebookFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
