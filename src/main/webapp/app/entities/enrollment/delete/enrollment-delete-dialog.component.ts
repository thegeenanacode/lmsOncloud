import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEnrollment } from '../enrollment.model';
import { EnrollmentService } from '../service/enrollment.service';

@Component({
  standalone: true,
  templateUrl: './enrollment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EnrollmentDeleteDialogComponent {
  enrollment?: IEnrollment;

  protected enrollmentService = inject(EnrollmentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.enrollmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
