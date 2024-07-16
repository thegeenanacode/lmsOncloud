import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppUserDetailComponent } from './app-user-detail.component';

describe('AppUser Management Detail Component', () => {
  let comp: AppUserDetailComponent;
  let fixture: ComponentFixture<AppUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUserDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AppUserDetailComponent,
              resolve: { appUser: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AppUserDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load appUser on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AppUserDetailComponent);

      // THEN
      expect(instance.appUser()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
