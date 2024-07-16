import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../content-library.test-samples';

import { ContentLibraryFormService } from './content-library-form.service';

describe('ContentLibrary Form Service', () => {
  let service: ContentLibraryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentLibraryFormService);
  });

  describe('Service methods', () => {
    describe('createContentLibraryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createContentLibraryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            resourceType: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IContentLibrary should create a new form with FormGroup', () => {
        const formGroup = service.createContentLibraryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            resourceType: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getContentLibrary', () => {
      it('should return NewContentLibrary for default ContentLibrary initial value', () => {
        const formGroup = service.createContentLibraryFormGroup(sampleWithNewData);

        const contentLibrary = service.getContentLibrary(formGroup) as any;

        expect(contentLibrary).toMatchObject(sampleWithNewData);
      });

      it('should return NewContentLibrary for empty ContentLibrary initial value', () => {
        const formGroup = service.createContentLibraryFormGroup();

        const contentLibrary = service.getContentLibrary(formGroup) as any;

        expect(contentLibrary).toMatchObject({});
      });

      it('should return IContentLibrary', () => {
        const formGroup = service.createContentLibraryFormGroup(sampleWithRequiredData);

        const contentLibrary = service.getContentLibrary(formGroup) as any;

        expect(contentLibrary).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IContentLibrary should not enable id FormControl', () => {
        const formGroup = service.createContentLibraryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewContentLibrary should disable id FormControl', () => {
        const formGroup = service.createContentLibraryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
