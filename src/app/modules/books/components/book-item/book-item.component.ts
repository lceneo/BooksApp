import {ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {map, Observable, tap} from "rxjs";
import {IBook} from "../../types/IBook";
import {BookService} from "../../services/book.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GetAuthorNamePipe} from "../../pipes/get-author-name.pipe";
import {GetGenreNamePipe} from "../../pipes/get-genre-name.pipe";
import {GetLanguageNamePipe} from "../../pipes/get-language-name.pipe";
import {MatCardModule} from "@angular/material/card";
import {NgLetDirective} from "../../../shared/directives/ng-let.directive";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {PaginatorComponent} from "../../../shared/components/paginator/paginator.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-book-item',
  standalone: true,
    imports: [CommonModule, RouterLink, GetAuthorNamePipe, GetGenreNamePipe, GetLanguageNamePipe, MatCardModule, NgLetDirective, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatTooltipModule, PaginatorComponent, TranslateModule],
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class BookItemComponent implements OnInit {
  constructor(
    private bookS: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  protected book$?: Observable<IBook | undefined>;
  protected loaded = signal(false);

  protected previousBookId = signal(0);
  protected nextBookId = signal(0);

  private currentBookID?: number;

  ngOnInit(): void {
    this.book$ = this.route.paramMap
      .pipe(
        map(map => +(map.get('id') as string)),
        tap((id) => this.currentBookID = id),
        map(id => this.bookS.getEntityByID(id)),
        tap(() =>  {
          const booksIDs = this.bookS.getEntities()
            .filter(book => book.ID !== this.currentBookID)
            .map(book => book.ID);

          //pushing it cause it can be not listed
          booksIDs.push(this.currentBookID as number);
          booksIDs.sort((f, s) => f - s);
          const currentIDIndex = booksIDs.findIndex(id => id === this.currentBookID);
          this.previousBookId.set(currentIDIndex !== 0 ? (this.currentBookID as number) - 1 : 0);
          this.nextBookId.set(currentIDIndex !== booksIDs.length - 1 ? (this.currentBookID as number) + 1 : 0);
          this.loaded.set(true);
        })
      );
  }

  protected switchPage(next: boolean) {
    if (next) { this.router.navigate(['../', this.nextBookId()], {relativeTo: this.route}); }
    else { this.router.navigate(['../', this.previousBookId()], {relativeTo: this.route}); }
  }
}
