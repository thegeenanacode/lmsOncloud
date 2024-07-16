import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAppUser, NewAppUser } from '../app-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppUser for edit and NewAppUserFormGroupInput for create.
 */
type AppUserFormGroupInput = IAppUser | PartialWithRequiredKeyOf<NewAppUser>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAppUser | NewAppUser> = Omit<T, 'createdDate' | 'lastModifiedDate' | 'lastLoginDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  lastLoginDate?: string | null;
};

type AppUserFormRawValue = FormValueOf<IAppUser>;

type NewAppUserFormRawValue = FormValueOf<NewAppUser>;

type AppUserFormDefaults = Pick<NewAppUser, 'id' | 'createdDate' | 'lastModifiedDate' | 'lastLoginDate' | 'isActive'>;

type AppUserFormGroupContent = {
  id: FormControl<AppUserFormRawValue['id'] | NewAppUser['id']>;
  username: FormControl<AppUserFormRawValue['username']>;
  password: FormControl<AppUserFormRawValue['password']>;
  email: FormControl<AppUserFormRawValue['email']>;
  role: FormControl<AppUserFormRawValue['role']>;
  firstName: FormControl<AppUserFormRawValue['firstName']>;
  lastName: FormControl<AppUserFormRawValue['lastName']>;
  createdDate: FormControl<AppUserFormRawValue['createdDate']>;
  lastModifiedDate: FormControl<AppUserFormRawValue['lastModifiedDate']>;
  lastLoginDate: FormControl<AppUserFormRawValue['lastLoginDate']>;
  isActive: FormControl<AppUserFormRawValue['isActive']>;
  enrollment: FormControl<AppUserFormRawValue['enrollment']>;
};

export type AppUserFormGroup = FormGroup<AppUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppUserFormService {
  createAppUserFormGroup(appUser: AppUserFormGroupInput = { id: null }): AppUserFormGroup {
    const appUserRawValue = this.convertAppUserToAppUserRawValue({
      ...this.getFormDefaults(),
      ...appUser,
    });
    return new FormGroup<AppUserFormGroupContent>({
      id: new FormControl(
        { value: appUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      username: new FormControl(appUserRawValue.username, {
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
      }),
      password: new FormControl(appUserRawValue.password, {
        validators: [Validators.required],
      }),
      email: new FormControl(appUserRawValue.email, {
        validators: [Validators.required, Validators.pattern('^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$')],
      }),
      role: new FormControl(appUserRawValue.role),
      firstName: new FormControl(appUserRawValue.firstName, {
        validators: [Validators.maxLength(50)],
      }),
      lastName: new FormControl(appUserRawValue.lastName, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(appUserRawValue.createdDate),
      lastModifiedDate: new FormControl(appUserRawValue.lastModifiedDate),
      lastLoginDate: new FormControl(appUserRawValue.lastLoginDate),
      isActive: new FormControl(appUserRawValue.isActive),
      enrollment: new FormControl(appUserRawValue.enrollment),
    });
  }

  getAppUser(form: AppUserFormGroup): IAppUser | NewAppUser {
    return this.convertAppUserRawValueToAppUser(form.getRawValue() as AppUserFormRawValue | NewAppUserFormRawValue);
  }

  resetForm(form: AppUserFormGroup, appUser: AppUserFormGroupInput): void {
    const appUserRawValue = this.convertAppUserToAppUserRawValue({ ...this.getFormDefaults(), ...appUser });
    form.reset(
      {
        ...appUserRawValue,
        id: { value: appUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AppUserFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      lastLoginDate: currentTime,
      isActive: false,
    };
  }

  private convertAppUserRawValueToAppUser(rawAppUser: AppUserFormRawValue | NewAppUserFormRawValue): IAppUser | NewAppUser {
    return {
      ...rawAppUser,
      createdDate: dayjs(rawAppUser.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAppUser.lastModifiedDate, DATE_TIME_FORMAT),
      lastLoginDate: dayjs(rawAppUser.lastLoginDate, DATE_TIME_FORMAT),
    };
  }

  private convertAppUserToAppUserRawValue(
    appUser: IAppUser | (Partial<NewAppUser> & AppUserFormDefaults),
  ): AppUserFormRawValue | PartialWithRequiredKeyOf<NewAppUserFormRawValue> {
    return {
      ...appUser,
      createdDate: appUser.createdDate ? appUser.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: appUser.lastModifiedDate ? appUser.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      lastLoginDate: appUser.lastLoginDate ? appUser.lastLoginDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
