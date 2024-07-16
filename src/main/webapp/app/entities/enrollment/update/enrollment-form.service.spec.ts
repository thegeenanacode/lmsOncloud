import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../enrollment.test-samples';

import { EnrollmentFormService } from './enrollment-form.service';

describe('Enrollment Form Service', () => {
  let service: EnrollmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentFormService);
  });

  describe('Service methods', () => {
    describe('createEnrollmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEnrollmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            enrollmentDate: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            user: expect.any(Object),
            course: expect.any(Object),
          }),
        );
      });

      it('passing IEnrollment should create a new form with FormGroup', () => {
        const formGroup = service.createEnrollmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            enrollmentDate: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            user: expect.any(Object),
            course: expect.any(Object),
          }),
        );
      });
    });

    describe('getEnrollment', () => {
      it('should return NewEnrollment for default Enrollment initial value', () => {
        const formGroup = service.createEnrollmentFormGroup(sampleWithNewData);

        const enrollment = service.getEnrollment(formGroup) as any;

        expect(enrollment).toMatchObject(sampleWithNewData);
      });

      it('should return NewEnrollment for empty Enrollment initial value', () => {
        const formGroup = service.createEnrollmentFormGroup();

        const enrollment = service.getEnrollment(formGroup) as any;

        expect(enrollment).toMatchObject({});
      });

      it('should return IEnrollment', () => {
        const formGroup = service.createEnrollmentFormGroup(sampleWithRequiredData);

        const enrollment = service.getEnrollment(formGroup) as any;

        expect(enrollment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEnrollment should not enable id FormControl', () => {
        const formGroup = service.createEnrollmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEnrollment should disable id FormControl', () => {
        const formGroup = service.createEnrollmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
