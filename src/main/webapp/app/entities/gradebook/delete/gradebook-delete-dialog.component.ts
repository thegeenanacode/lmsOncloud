import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGradebook } from '../gradebook.model';
import { GradebookService } from '../service/gradebook.service';

@Component({
  standalone: true,
  templateUrl: './gradebook-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GradebookDeleteDialogComponent {
  gradebook?: IGradebook;

  protected gradebookService = inject(GradebookService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gradebookService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
