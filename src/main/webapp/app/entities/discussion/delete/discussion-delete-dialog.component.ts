import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDiscussion } from '../discussion.model';
import { DiscussionService } from '../service/discussion.service';

@Component({
  standalone: true,
  templateUrl: './discussion-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DiscussionDeleteDialogComponent {
  discussion?: IDiscussion;

  protected discussionService = inject(DiscussionService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.discussionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
