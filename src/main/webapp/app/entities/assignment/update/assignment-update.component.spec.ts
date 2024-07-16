import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { AssignmentService } from '../service/assignment.service';
import { IAssignment } from '../assignment.model';
import { AssignmentFormService } from './assignment-form.service';

import { AssignmentUpdateComponent } from './assignment-update.component';

describe('Assignment Management Update Component', () => {
  let comp: AssignmentUpdateComponent;
  let fixture: ComponentFixture<AssignmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assignmentFormService: AssignmentFormService;
  let assignmentService: AssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssignmentUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AssignmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssignmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assignmentFormService = TestBed.inject(AssignmentFormService);
    assignmentService = TestBed.inject(AssignmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const assignment: IAssignment = { id: 456 };

      activatedRoute.data = of({ assignment });
      comp.ngOnInit();

      expect(comp.assignment).toEqual(assignment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssignment>>();
      const assignment = { id: 123 };
      jest.spyOn(assignmentFormService, 'getAssignment').mockReturnValue(assignment);
      jest.spyOn(assignmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assignment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assignment }));
      saveSubject.complete();

      // THEN
      expect(assignmentFormService.getAssignment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(assignmentService.update).toHaveBeenCalledWith(expect.objectContaining(assignment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssignment>>();
      const assignment = { id: 123 };
      jest.spyOn(assignmentFormService, 'getAssignment').mockReturnValue({ id: null });
      jest.spyOn(assignmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assignment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assignment }));
      saveSubject.complete();

      // THEN
      expect(assignmentFormService.getAssignment).toHaveBeenCalled();
      expect(assignmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssignment>>();
      const assignment = { id: 123 };
      jest.spyOn(assignmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assignment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assignmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
