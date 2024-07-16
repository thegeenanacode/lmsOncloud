import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IQuiz } from '../quiz.model';
import { QuizService } from '../service/quiz.service';

@Component({
  standalone: true,
  templateUrl: './quiz-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class QuizDeleteDialogComponent {
  quiz?: IQuiz;

  protected quizService = inject(QuizService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.quizService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
