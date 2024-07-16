import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAnnouncement } from '../announcement.model';
import { AnnouncementService } from '../service/announcement.service';

@Component({
  standalone: true,
  templateUrl: './announcement-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AnnouncementDeleteDialogComponent {
  announcement?: IAnnouncement;

  protected announcementService = inject(AnnouncementService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.announcementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
