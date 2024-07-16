import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { AnnouncementService } from '../service/announcement.service';
import { IAnnouncement } from '../announcement.model';
import { AnnouncementFormService } from './announcement-form.service';

import { AnnouncementUpdateComponent } from './announcement-update.component';

describe('Announcement Management Update Component', () => {
  let comp: AnnouncementUpdateComponent;
  let fixture: ComponentFixture<AnnouncementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let announcementFormService: AnnouncementFormService;
  let announcementService: AnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnnouncementUpdateComponent],
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
      .overrideTemplate(AnnouncementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnnouncementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    announcementFormService = TestBed.inject(AnnouncementFormService);
    announcementService = TestBed.inject(AnnouncementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const announcement: IAnnouncement = { id: 456 };

      activatedRoute.data = of({ announcement });
      comp.ngOnInit();

      expect(comp.announcement).toEqual(announcement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnouncement>>();
      const announcement = { id: 123 };
      jest.spyOn(announcementFormService, 'getAnnouncement').mockReturnValue(announcement);
      jest.spyOn(announcementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ announcement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: announcement }));
      saveSubject.complete();

      // THEN
      expect(announcementFormService.getAnnouncement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(announcementService.update).toHaveBeenCalledWith(expect.objectContaining(announcement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnouncement>>();
      const announcement = { id: 123 };
      jest.spyOn(announcementFormService, 'getAnnouncement').mockReturnValue({ id: null });
      jest.spyOn(announcementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ announcement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: announcement }));
      saveSubject.complete();

      // THEN
      expect(announcementFormService.getAnnouncement).toHaveBeenCalled();
      expect(announcementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnouncement>>();
      const announcement = { id: 123 };
      jest.spyOn(announcementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ announcement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(announcementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
