import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ContentLibraryService } from '../service/content-library.service';
import { IContentLibrary } from '../content-library.model';
import { ContentLibraryFormService } from './content-library-form.service';

import { ContentLibraryUpdateComponent } from './content-library-update.component';

describe('ContentLibrary Management Update Component', () => {
  let comp: ContentLibraryUpdateComponent;
  let fixture: ComponentFixture<ContentLibraryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contentLibraryFormService: ContentLibraryFormService;
  let contentLibraryService: ContentLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentLibraryUpdateComponent],
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
      .overrideTemplate(ContentLibraryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContentLibraryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contentLibraryFormService = TestBed.inject(ContentLibraryFormService);
    contentLibraryService = TestBed.inject(ContentLibraryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const contentLibrary: IContentLibrary = { id: 456 };

      activatedRoute.data = of({ contentLibrary });
      comp.ngOnInit();

      expect(comp.contentLibrary).toEqual(contentLibrary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContentLibrary>>();
      const contentLibrary = { id: 123 };
      jest.spyOn(contentLibraryFormService, 'getContentLibrary').mockReturnValue(contentLibrary);
      jest.spyOn(contentLibraryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contentLibrary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contentLibrary }));
      saveSubject.complete();

      // THEN
      expect(contentLibraryFormService.getContentLibrary).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(contentLibraryService.update).toHaveBeenCalledWith(expect.objectContaining(contentLibrary));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContentLibrary>>();
      const contentLibrary = { id: 123 };
      jest.spyOn(contentLibraryFormService, 'getContentLibrary').mockReturnValue({ id: null });
      jest.spyOn(contentLibraryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contentLibrary: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contentLibrary }));
      saveSubject.complete();

      // THEN
      expect(contentLibraryFormService.getContentLibrary).toHaveBeenCalled();
      expect(contentLibraryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContentLibrary>>();
      const contentLibrary = { id: 123 };
      jest.spyOn(contentLibraryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contentLibrary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contentLibraryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
