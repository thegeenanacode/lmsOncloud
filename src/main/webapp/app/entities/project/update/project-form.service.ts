import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProject, NewProject } from '../project.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProject for edit and NewProjectFormGroupInput for create.
 */
type ProjectFormGroupInput = IProject | PartialWithRequiredKeyOf<NewProject>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProject | NewProject> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ProjectFormRawValue = FormValueOf<IProject>;

type NewProjectFormRawValue = FormValueOf<NewProject>;

type ProjectFormDefaults = Pick<NewProject, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ProjectFormGroupContent = {
  id: FormControl<ProjectFormRawValue['id'] | NewProject['id']>;
  projectName: FormControl<ProjectFormRawValue['projectName']>;
  projectDescription: FormControl<ProjectFormRawValue['projectDescription']>;
  submissionDate: FormControl<ProjectFormRawValue['submissionDate']>;
  createdBy: FormControl<ProjectFormRawValue['createdBy']>;
  createdDate: FormControl<ProjectFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProjectFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProjectFormRawValue['lastModifiedDate']>;
};

export type ProjectFormGroup = FormGroup<ProjectFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectFormService {
  createProjectFormGroup(project: ProjectFormGroupInput = { id: null }): ProjectFormGroup {
    const projectRawValue = this.convertProjectToProjectRawValue({
      ...this.getFormDefaults(),
      ...project,
    });
    return new FormGroup<ProjectFormGroupContent>({
      id: new FormControl(
        { value: projectRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      projectName: new FormControl(projectRawValue.projectName, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      projectDescription: new FormControl(projectRawValue.projectDescription),
      submissionDate: new FormControl(projectRawValue.submissionDate),
      createdBy: new FormControl(projectRawValue.createdBy),
      createdDate: new FormControl(projectRawValue.createdDate),
      lastModifiedBy: new FormControl(projectRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(projectRawValue.lastModifiedDate),
    });
  }

  getProject(form: ProjectFormGroup): IProject | NewProject {
    return this.convertProjectRawValueToProject(form.getRawValue() as ProjectFormRawValue | NewProjectFormRawValue);
  }

  resetForm(form: ProjectFormGroup, project: ProjectFormGroupInput): void {
    const projectRawValue = this.convertProjectToProjectRawValue({ ...this.getFormDefaults(), ...project });
    form.reset(
      {
        ...projectRawValue,
        id: { value: projectRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertProjectRawValueToProject(rawProject: ProjectFormRawValue | NewProjectFormRawValue): IProject | NewProject {
    return {
      ...rawProject,
      createdDate: dayjs(rawProject.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProject.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertProjectToProjectRawValue(
    project: IProject | (Partial<NewProject> & ProjectFormDefaults),
  ): ProjectFormRawValue | PartialWithRequiredKeyOf<NewProjectFormRawValue> {
    return {
      ...project,
      createdDate: project.createdDate ? project.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: project.lastModifiedDate ? project.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
