import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookFilterComponent, IFilter} from "../../../books/components/book-filter/book-filter.component";
import {FilterPipe} from "../../../books/pipes/filter.pipe";
import {GetAuthorNamePipe} from "../../../books/pipes/get-author-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {NgLetDirective} from "../../../shared/directives/ng-let.directive";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {AuthorService} from "../../services/author.service";
import {IAuthor} from "../../types/IAuthor";
import {GetCountryNamePipe} from "../../pipes/get-country-name.pipe";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AuthorEditComponent} from "../author-edit/author-edit.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [CommonModule, BookFilterComponent, FilterPipe, GetAuthorNamePipe,
    MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule, RouterLink,
    GetCountryNamePipe, NgLetDirective, MatDialogModule, TranslateModule],
  templateUrl: './authors-list.component.html',
  styleUrls: ['../../../shared/styles/items-list.scss','./authors-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthorsListComponent {


  constructor(
    private authorsS: AuthorService,
    private matDialog: MatDialog
  ) {}

  protected authors = this.authorsS.getEntitiesAsync();

  trackAuthor(index: number, author: IAuthor): number {
    return author.ID;
  }

  editAuthor(authorID: number) {
    this.matDialog.open(AuthorEditComponent, {
      data: {
        authorID
      }
    });
  }
}
