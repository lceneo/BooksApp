import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {

  @Output()
  public previousPageTriggered = new EventEmitter<void>();

  @Output()
  public nextPageTriggered = new EventEmitter<void>();


  @Input({required: true})
  public previousPageAvailable = true;

  @Input({required: true})
  public nextPageAvailable = true;

  protected switchPage(next: boolean) {
    if (next) { this.nextPageTriggered.next(); }
    else { this.previousPageTriggered.next(); }
  }

}
