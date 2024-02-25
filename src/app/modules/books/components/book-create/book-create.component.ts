import {ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {GetLanguageNamePipe} from "../../pipes/get-language-name.pipe";
import {GetGenreNamePipe} from "../../pipes/get-genre-name.pipe";
import {MatListModule} from "@angular/material/list";
import {AuthorService} from "../../../authors/services/author.service";
import {LanguageService} from "../../services/language.service";
import {GenreService} from "../../services/genre.service";
import {GetAuthorNamePipe} from "../../pipes/get-author-name.pipe";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MyValidatorsService} from "../../../shared/services/my-validators.service";
import {MatButtonModule} from "@angular/material/button";
import {TextareaResizeDirective} from "../../../shared/directives/text-area-resize.directive";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BookService} from "../../services/book.service";
import {IBook} from "../../types/IBook";
import {Router} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DialogConfirmComponent} from "../../../shared/components/dialog-confirm/dialog-confirm.component";
import {ErrorTextComponent} from "../../../shared/components/error-text/error-text.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatIconModule, GetLanguageNamePipe, GetGenreNamePipe, MatListModule, GetAuthorNamePipe,
    ReactiveFormsModule, MatButtonModule, TextareaResizeDirective, MatTooltipModule, MatDialogModule, ErrorTextComponent, TranslateModule],
  templateUrl: './book-create.component.html',
  styleUrls: ['../../../shared/styles/item-create.scss','./book-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class BookCreateComponent implements OnInit {
  constructor(
    private bookS: BookService,
    private authorsS: AuthorService,
    private languageS: LanguageService,
    private genreS: GenreService,
    private myValidatorsS: MyValidatorsService,
    private destroyRef: DestroyRef,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  protected authors = this.authorsS.getEntitiesAsync();
  protected languages = this.languageS.getEntitiesAsync();
  protected genres = this.genreS.getEntitiesAsync();

  protected resetBtnDisabled = signal(true);

  private firstBookPublishDate = -2400;

  private initialFormState = {
    title: '',
    authorID: null,
    languageID: null,
    description: '',
    publicationYear: new Date().getFullYear(),
    pagesNumber: 10,
    genreID: null
  }

  protected bookForm = new FormGroup({
    title: new FormControl(this.initialFormState.title, [this.myValidatorsS.minLengthTrimValidator(3), this.myValidatorsS.maxLengthTrimValidator(30)]),
    authorID: new FormControl(this.initialFormState.authorID, [Validators.required]),
    languageID: new FormControl(this.initialFormState.languageID, [Validators.required]),
    description: new FormControl(this.initialFormState.description, [this.myValidatorsS.maxLengthTrimValidator(300)]),
    publicationYear: new FormControl(this.initialFormState.publicationYear, [Validators.required, Validators.min(this.firstBookPublishDate), Validators.max(new Date().getFullYear())]),
    pagesNumber: new FormControl(this.initialFormState.pagesNumber, [Validators.required, Validators.min(10), Validators.max(5000)]),
    genreID: new FormControl(this.initialFormState.genreID, [Validators.required])
  });

  ngOnInit(): void {
    this.bookForm.valueChanges
      .pipe(
        debounceTime(300),
        map(value => JSON.stringify(value) === JSON.stringify(this.initialFormState)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => this.resetBtnDisabled.set(value));
  }

  protected createNewBook() {
    const newBook = {...this.bookForm.value, genreID: this.bookForm.value.genreID![0]};
    this.bookS.addEntity(newBook as unknown as IBook);
    this.router.navigate(['books']);
  }
  protected resetForm() {
    this.bookForm.reset(this.initialFormState);
  }

  protected returnToTheBookList() {
    this.matDialog.open(DialogConfirmComponent, {
      data: {
        title: 'Leaving the page',
        text: 'Are you sure you want to leave the page? All made changes won\'t be saved'
      },
      disableClose: true
    }).afterClosed()
      .subscribe(option => {
      if (option) { this.router.navigate(['books']); }
    })
  }
}
