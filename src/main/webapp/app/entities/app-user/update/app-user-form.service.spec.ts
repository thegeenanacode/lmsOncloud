import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../app-user.test-samples';

import { AppUserFormService } from './app-user-form.service';

describe('AppUser Form Service', () => {
  let service: AppUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUserFormService);
  });

  describe('Service methods', () => {
    describe('createAppUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAppUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            password: expect.any(Object),
            email: expect.any(Object),
            role: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastLoginDate: expect.any(Object),
            isActive: expect.any(Object),
            enrollment: expect.any(Object),
          }),
        );
      });

      it('passing IAppUser should create a new form with FormGroup', () => {
        const formGroup = service.createAppUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            password: expect.any(Object),
            email: expect.any(Object),
            role: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            lastLoginDate: expect.any(Object),
            isActive: expect.any(Object),
            enrollment: expect.any(Object),
          }),
        );
      });
    });

    describe('getAppUser', () => {
      it('should return NewAppUser for default AppUser initial value', () => {
        const formGroup = service.createAppUserFormGroup(sampleWithNewData);

        const appUser = service.getAppUser(formGroup) as any;

        expect(appUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewAppUser for empty AppUser initial value', () => {
        const formGroup = service.createAppUserFormGroup();

        const appUser = service.getAppUser(formGroup) as any;

        expect(appUser).toMatchObject({});
      });

      it('should return IAppUser', () => {
        const formGroup = service.createAppUserFormGroup(sampleWithRequiredData);

        const appUser = service.getAppUser(formGroup) as any;

        expect(appUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAppUser should not enable id FormControl', () => {
        const formGroup = service.createAppUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAppUser should disable id FormControl', () => {
        const formGroup = service.createAppUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
