import {ChangeDetectionStrategy, Component, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookService} from "../../services/book.service";
import {MatCardModule} from "@angular/material/card";
import {GetAuthorNamePipe} from "../../pipes/get-author-name.pipe";
import {GetGenreNamePipe} from "../../pipes/get-genre-name.pipe";
import {GetLanguageNamePipe} from "../../pipes/get-language-name.pipe";
import {BookFilterComponent, IFilter} from "../book-filter/book-filter.component";
import {IBook} from "../../types/IBook";
import {FilterPipe} from "../../pipes/filter.pipe";
import {NgLetDirective} from "../../../shared/directives/ng-let.directive";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, GetAuthorNamePipe,
    GetGenreNamePipe, GetLanguageNamePipe, BookFilterComponent, FilterPipe, NgLetDirective, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, TranslateModule],
  templateUrl: './books-list.component.html',
  styleUrls: ['../../../shared/styles/items-list.scss', './books-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class BooksListComponent {

  constructor(
    private bookS: BookService
  ) {}

  protected books = this.bookS.getEntitiesAsync();
  protected booksFilter = signal(null as unknown as IFilter);

  trackBook(index: number, book: IBook): number {
    return book.ID;
  }
}
