import {BookService} from "../../services/book.service";
import {ComponentFixture, fakeAsync, TestBed} from "@angular/core/testing";
import {IBook} from "../../types/IBook";
import BooksListComponent from "./books-list.component";
import {BooksListPageObject} from "./BooksListPageObject";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {GetAuthorNamePipe} from "../../pipes/get-author-name.pipe";
import {GetGenreNamePipe} from "../../pipes/get-genre-name.pipe";
import {GetLanguageNamePipe} from "../../pipes/get-language-name.pipe";
import {BookFilterComponent} from "../book-filter/book-filter.component";
import {FilterPipe} from "../../pipes/filter.pipe";
import {NgLetDirective} from "../../../shared/directives/ng-let.directive";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;
  let service: BookService;
  let page: BooksListPageObject;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, MatCardModule, GetAuthorNamePipe,
        GetGenreNamePipe, GetLanguageNamePipe, BookFilterComponent,
        FilterPipe, NgLetDirective, RouterLink, MatIconModule,
        MatButtonModule, MatTooltipModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [
        translationSMock
      ]
    });
    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    page = new BooksListPageObject(fixture.nativeElement);
    service = TestBed.inject(BookService);
    service.clearStore();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be blank at the start', () => {
    expect(page.isEmpty).toBeTruthy();
  });

  it('should add 2 books', () => {
    service.addEntity(mockBooks[0]); service.addEntity(mockBooks[1]);
    fixture.detectChanges();
    expect(page.getBooksElementsList().length).toBe(2);
  });

  it('should change number of books on filter apply', () => {
    service.addEntity(mockBooks[0]); service.addEntity(mockBooks[1]);
    fixture.detectChanges();
    expect(page.getBooksElementsList().length).toBe(2);

    component['booksFilter'].update(filter => ({...filter, pageLimit: {minPageCount: 400, maxPageCount: 5000}}));
    fixture.detectChanges();
    expect(page.getBooksElementsList().length).toBe(1);
  });
})


const translationSMock =         {
  provide: TranslateService, useValue: {
    get: () => of(''),
    onTranslationChange: of(''),
    onLangChange: of(''),
    onDefaultLangChange: of('')
  }};

const mockBooks: Omit<IBook, 'ID'>[] = [
  {title: 'The Adventures of Tom Sawyer' ,authorID: 1, genreID: 1, languageID: 1, pagesNumber: 632, publicationYear: 1876,
    description: 'The Adventures of Tom Sawyer (also simply known as Tom Sawyer) is an 1876 novel by Mark Twain about a boy growing' +
      ' up along the Mississippi River. It is set in the 1840\'s in the town of St. Petersburg, which is based on Hannibal, Missouri,' +
      ' where Twain lived as a boy.'
  },
  { title: 'The Golden Key' ,authorID: 2, genreID: 2, languageID: 2, pagesNumber: 342, publicationYear: 1936,
    description: 'a fairy tale story by Soviet writer Alexei Tolstoy, which is a literary treatment of Carlo Collodi\'s' +
      ' tale The Adventures of Pinocchio. The Story of the Wooden Doll. Tolstoy dedicated the book to his future fourth and' +
      ' last wife, Lyudmila Krestinskaya.' },
]
