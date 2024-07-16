import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IModule, NewModule } from '../module.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IModule for edit and NewModuleFormGroupInput for create.
 */
type ModuleFormGroupInput = IModule | PartialWithRequiredKeyOf<NewModule>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IModule | NewModule> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ModuleFormRawValue = FormValueOf<IModule>;

type NewModuleFormRawValue = FormValueOf<NewModule>;

type ModuleFormDefaults = Pick<NewModule, 'id' | 'createdDate' | 'lastModifiedDate' | 'courses'>;

type ModuleFormGroupContent = {
  id: FormControl<ModuleFormRawValue['id'] | NewModule['id']>;
  title: FormControl<ModuleFormRawValue['title']>;
  description: FormControl<ModuleFormRawValue['description']>;
  createdBy: FormControl<ModuleFormRawValue['createdBy']>;
  createdDate: FormControl<ModuleFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ModuleFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ModuleFormRawValue['lastModifiedDate']>;
  courses: FormControl<ModuleFormRawValue['courses']>;
};

export type ModuleFormGroup = FormGroup<ModuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModuleFormService {
  createModuleFormGroup(module: ModuleFormGroupInput = { id: null }): ModuleFormGroup {
    const moduleRawValue = this.convertModuleToModuleRawValue({
      ...this.getFormDefaults(),
      ...module,
    });
    return new FormGroup<ModuleFormGroupContent>({
      id: new FormControl(
        { value: moduleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(moduleRawValue.title, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: new FormControl(moduleRawValue.description),
      createdBy: new FormControl(moduleRawValue.createdBy),
      createdDate: new FormControl(moduleRawValue.createdDate),
      lastModifiedBy: new FormControl(moduleRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(moduleRawValue.lastModifiedDate),
      courses: new FormControl(moduleRawValue.courses ?? []),
    });
  }

  getModule(form: ModuleFormGroup): IModule | NewModule {
    return this.convertModuleRawValueToModule(form.getRawValue() as ModuleFormRawValue | NewModuleFormRawValue);
  }

  resetForm(form: ModuleFormGroup, module: ModuleFormGroupInput): void {
    const moduleRawValue = this.convertModuleToModuleRawValue({ ...this.getFormDefaults(), ...module });
    form.reset(
      {
        ...moduleRawValue,
        id: { value: moduleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ModuleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      courses: [],
    };
  }

  private convertModuleRawValueToModule(rawModule: ModuleFormRawValue | NewModuleFormRawValue): IModule | NewModule {
    return {
      ...rawModule,
      createdDate: dayjs(rawModule.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawModule.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertModuleToModuleRawValue(
    module: IModule | (Partial<NewModule> & ModuleFormDefaults),
  ): ModuleFormRawValue | PartialWithRequiredKeyOf<NewModuleFormRawValue> {
    return {
      ...module,
      createdDate: module.createdDate ? module.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: module.lastModifiedDate ? module.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      courses: module.courses ?? [],
    };
  }
}
