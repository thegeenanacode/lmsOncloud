import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../message.test-samples';

import { MessageFormService } from './message-form.service';

describe('Message Form Service', () => {
  let service: MessageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageFormService);
  });

  describe('Service methods', () => {
    describe('createMessageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMessageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            timestamp: expect.any(Object),
            sender: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IMessage should create a new form with FormGroup', () => {
        const formGroup = service.createMessageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            timestamp: expect.any(Object),
            sender: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getMessage', () => {
      it('should return NewMessage for default Message initial value', () => {
        const formGroup = service.createMessageFormGroup(sampleWithNewData);

        const message = service.getMessage(formGroup) as any;

        expect(message).toMatchObject(sampleWithNewData);
      });

      it('should return NewMessage for empty Message initial value', () => {
        const formGroup = service.createMessageFormGroup();

        const message = service.getMessage(formGroup) as any;

        expect(message).toMatchObject({});
      });

      it('should return IMessage', () => {
        const formGroup = service.createMessageFormGroup(sampleWithRequiredData);

        const message = service.getMessage(formGroup) as any;

        expect(message).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMessage should not enable id FormControl', () => {
        const formGroup = service.createMessageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMessage should disable id FormControl', () => {
        const formGroup = service.createMessageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
