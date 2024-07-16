import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IContentLibrary } from '../content-library.model';
import { ContentLibraryService } from '../service/content-library.service';

@Component({
  standalone: true,
  templateUrl: './content-library-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ContentLibraryDeleteDialogComponent {
  contentLibrary?: IContentLibrary;

  protected contentLibraryService = inject(ContentLibraryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contentLibraryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
