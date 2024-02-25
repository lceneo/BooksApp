import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {AuthorService} from "../../../authors/services/author.service";
import {GetAuthorNamePipe} from "../../pipes/get-author-name.pipe";
import {LanguageService} from "../../services/language.service";
import {GetLanguageNamePipe} from "../../pipes/get-language-name.pipe";
import {MatListModule} from "@angular/material/list";
import {GenreService} from "../../services/genre.service";
import {GetGenreNamePipe} from "../../pipes/get-genre-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatSliderModule} from "@angular/material/slider";
import {MatSliderWrapperComponent} from "../../../shared/components/mat-slider-wrapper/mat-slider-wrapper.component";
import {MyValidatorsService} from "../../../shared/services/my-validators.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-book-filter',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatSelectModule, GetAuthorNamePipe, GetLanguageNamePipe, MatListModule,
    GetGenreNamePipe, MatButtonModule, MatSliderModule, MatSliderWrapperComponent, MatIconModule, TranslateModule],
  templateUrl: './book-filter.component.html',
  styleUrls: ['./book-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookFilterComponent implements OnInit {

  constructor(
    private authorsS: AuthorService,
    private languageS: LanguageService,
    private genreS: GenreService,
    private myValidatorsS: MyValidatorsService,
    private destroyRef: DestroyRef
  ) {}

  @Output() filterChange$ = new EventEmitter();

  protected filterForm?: FormGroup<Record<keyof IFilter, FormControl>>;

  protected authors = this.authorsS.getEntitiesAsync();
  protected languages = this.languageS.getEntitiesAsync();
  protected genres = this.genreS.getEntitiesAsync();

  protected applyButtonDisabled = signal(false);

  protected minPagesCount = 10;
  protected maxPagesCount = 5010;

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
   this.filterForm = new FormGroup({
     searchString: new FormControl(''),
     authorsIDs: new FormControl([]),
     languagesIDs: new FormControl([]),
     pageLimit: new FormControl({}, [this.myValidatorsS.pageLimitValidator(this.minPagesCount, this.maxPagesCount)]),
     genreID: new FormControl(0)
   });

   //recalculating apply btn status
   this.filterForm.statusChanges.
     pipe(
       takeUntilDestroyed(this.destroyRef)
   ).
   subscribe(stat => this.applyButtonDisabled.set(stat === 'INVALID'));
  }

  protected submitValue() {
    this.filterChange$.next(
        {...this.filterForm?.value,
          searchString: this.filterForm?.value.searchString.toLowerCase().replace(/\s+/g, ''),
          genreID: this.filterForm?.value.genreID[0]
        });
  }

  protected resetForm() {
    //getting rid of null values by specifying reset state
    this.filterForm?.reset({
      searchString: '',
      authorsIDs: [],
      languagesIDs: [],
      pageLimit: {},
      genreID: 0
    });
    this.submitValue();
  }
}


export interface IFilter {
  searchString: string;
  authorsIDs: number[];
  languagesIDs: number[];
  pageLimit?: PageLimitType;
  genreID?: number;
}

export type PageLimitType = {
  minPageCount?: number;
  maxPageCount?: number;
}
