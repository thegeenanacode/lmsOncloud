import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../discussion.test-samples';

import { DiscussionFormService } from './discussion-form.service';

describe('Discussion Form Service', () => {
  let service: DiscussionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionFormService);
  });

  describe('Service methods', () => {
    describe('createDiscussionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDiscussionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            topic: expect.any(Object),
            details: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            course: expect.any(Object),
          }),
        );
      });

      it('passing IDiscussion should create a new form with FormGroup', () => {
        const formGroup = service.createDiscussionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            topic: expect.any(Object),
            details: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            course: expect.any(Object),
          }),
        );
      });
    });

    describe('getDiscussion', () => {
      it('should return NewDiscussion for default Discussion initial value', () => {
        const formGroup = service.createDiscussionFormGroup(sampleWithNewData);

        const discussion = service.getDiscussion(formGroup) as any;

        expect(discussion).toMatchObject(sampleWithNewData);
      });

      it('should return NewDiscussion for empty Discussion initial value', () => {
        const formGroup = service.createDiscussionFormGroup();

        const discussion = service.getDiscussion(formGroup) as any;

        expect(discussion).toMatchObject({});
      });

      it('should return IDiscussion', () => {
        const formGroup = service.createDiscussionFormGroup(sampleWithRequiredData);

        const discussion = service.getDiscussion(formGroup) as any;

        expect(discussion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDiscussion should not enable id FormControl', () => {
        const formGroup = service.createDiscussionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDiscussion should disable id FormControl', () => {
        const formGroup = service.createDiscussionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
