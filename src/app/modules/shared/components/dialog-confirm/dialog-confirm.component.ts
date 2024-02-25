import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: IMatDialogData,
    private matDialogRef: MatDialogRef<IMatDialogData>
  ) {}

  protected pickOption(option: boolean) {
    this.matDialogRef.close(option);
  }
}

export interface IMatDialogData {
  title: string;
  text: string;
}
