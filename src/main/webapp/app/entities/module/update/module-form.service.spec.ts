import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../module.test-samples';

import { ModuleFormService } from './module-form.service';

describe('Module Form Service', () => {
  let service: ModuleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleFormService);
  });

  describe('Service methods', () => {
    describe('createModuleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createModuleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            courses: expect.any(Object),
          }),
        );
      });

      it('passing IModule should create a new form with FormGroup', () => {
        const formGroup = service.createModuleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            courses: expect.any(Object),
          }),
        );
      });
    });

    describe('getModule', () => {
      it('should return NewModule for default Module initial value', () => {
        const formGroup = service.createModuleFormGroup(sampleWithNewData);

        const module = service.getModule(formGroup) as any;

        expect(module).toMatchObject(sampleWithNewData);
      });

      it('should return NewModule for empty Module initial value', () => {
        const formGroup = service.createModuleFormGroup();

        const module = service.getModule(formGroup) as any;

        expect(module).toMatchObject({});
      });

      it('should return IModule', () => {
        const formGroup = service.createModuleFormGroup(sampleWithRequiredData);

        const module = service.getModule(formGroup) as any;

        expect(module).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IModule should not enable id FormControl', () => {
        const formGroup = service.createModuleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewModule should disable id FormControl', () => {
        const formGroup = service.createModuleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
