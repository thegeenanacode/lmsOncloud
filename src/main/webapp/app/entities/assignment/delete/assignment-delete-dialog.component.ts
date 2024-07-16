import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAssignment } from '../assignment.model';
import { AssignmentService } from '../service/assignment.service';

@Component({
  standalone: true,
  templateUrl: './assignment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AssignmentDeleteDialogComponent {
  assignment?: IAssignment;

  protected assignmentService = inject(AssignmentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assignmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
