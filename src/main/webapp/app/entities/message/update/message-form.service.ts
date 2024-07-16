import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMessage, NewMessage } from '../message.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMessage for edit and NewMessageFormGroupInput for create.
 */
type MessageFormGroupInput = IMessage | PartialWithRequiredKeyOf<NewMessage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMessage | NewMessage> = Omit<T, 'timestamp' | 'createdDate' | 'lastModifiedDate'> & {
  timestamp?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type MessageFormRawValue = FormValueOf<IMessage>;

type NewMessageFormRawValue = FormValueOf<NewMessage>;

type MessageFormDefaults = Pick<NewMessage, 'id' | 'timestamp' | 'createdDate' | 'lastModifiedDate'>;

type MessageFormGroupContent = {
  id: FormControl<MessageFormRawValue['id'] | NewMessage['id']>;
  content: FormControl<MessageFormRawValue['content']>;
  timestamp: FormControl<MessageFormRawValue['timestamp']>;
  sender: FormControl<MessageFormRawValue['sender']>;
  createdBy: FormControl<MessageFormRawValue['createdBy']>;
  createdDate: FormControl<MessageFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<MessageFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<MessageFormRawValue['lastModifiedDate']>;
  user: FormControl<MessageFormRawValue['user']>;
};

export type MessageFormGroup = FormGroup<MessageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MessageFormService {
  createMessageFormGroup(message: MessageFormGroupInput = { id: null }): MessageFormGroup {
    const messageRawValue = this.convertMessageToMessageRawValue({
      ...this.getFormDefaults(),
      ...message,
    });
    return new FormGroup<MessageFormGroupContent>({
      id: new FormControl(
        { value: messageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      content: new FormControl(messageRawValue.content, {
        validators: [Validators.required],
      }),
      timestamp: new FormControl(messageRawValue.timestamp, {
        validators: [Validators.required],
      }),
      sender: new FormControl(messageRawValue.sender),
      createdBy: new FormControl(messageRawValue.createdBy),
      createdDate: new FormControl(messageRawValue.createdDate),
      lastModifiedBy: new FormControl(messageRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(messageRawValue.lastModifiedDate),
      user: new FormControl(messageRawValue.user),
    });
  }

  getMessage(form: MessageFormGroup): IMessage | NewMessage {
    return this.convertMessageRawValueToMessage(form.getRawValue() as MessageFormRawValue | NewMessageFormRawValue);
  }

  resetForm(form: MessageFormGroup, message: MessageFormGroupInput): void {
    const messageRawValue = this.convertMessageToMessageRawValue({ ...this.getFormDefaults(), ...message });
    form.reset(
      {
        ...messageRawValue,
        id: { value: messageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MessageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMessageRawValueToMessage(rawMessage: MessageFormRawValue | NewMessageFormRawValue): IMessage | NewMessage {
    return {
      ...rawMessage,
      timestamp: dayjs(rawMessage.timestamp, DATE_TIME_FORMAT),
      createdDate: dayjs(rawMessage.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMessage.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMessageToMessageRawValue(
    message: IMessage | (Partial<NewMessage> & MessageFormDefaults),
  ): MessageFormRawValue | PartialWithRequiredKeyOf<NewMessageFormRawValue> {
    return {
      ...message,
      timestamp: message.timestamp ? message.timestamp.format(DATE_TIME_FORMAT) : undefined,
      createdDate: message.createdDate ? message.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: message.lastModifiedDate ? message.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
