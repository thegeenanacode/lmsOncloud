import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../announcement.test-samples';

import { AnnouncementFormService } from './announcement-form.service';

describe('Announcement Form Service', () => {
  let service: AnnouncementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementFormService);
  });

  describe('Service methods', () => {
    describe('createAnnouncementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAnnouncementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            publishDate: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IAnnouncement should create a new form with FormGroup', () => {
        const formGroup = service.createAnnouncementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            publishDate: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getAnnouncement', () => {
      it('should return NewAnnouncement for default Announcement initial value', () => {
        const formGroup = service.createAnnouncementFormGroup(sampleWithNewData);

        const announcement = service.getAnnouncement(formGroup) as any;

        expect(announcement).toMatchObject(sampleWithNewData);
      });

      it('should return NewAnnouncement for empty Announcement initial value', () => {
        const formGroup = service.createAnnouncementFormGroup();

        const announcement = service.getAnnouncement(formGroup) as any;

        expect(announcement).toMatchObject({});
      });

      it('should return IAnnouncement', () => {
        const formGroup = service.createAnnouncementFormGroup(sampleWithRequiredData);

        const announcement = service.getAnnouncement(formGroup) as any;

        expect(announcement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAnnouncement should not enable id FormControl', () => {
        const formGroup = service.createAnnouncementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAnnouncement should disable id FormControl', () => {
        const formGroup = service.createAnnouncementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
