import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IModule } from '../module.model';
import { ModuleService } from '../service/module.service';

@Component({
  standalone: true,
  templateUrl: './module-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ModuleDeleteDialogComponent {
  module?: IModule;

  protected moduleService = inject(ModuleService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moduleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
