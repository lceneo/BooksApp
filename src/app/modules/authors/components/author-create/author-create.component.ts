import {Component, DestroyRef, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GetAuthorNamePipe} from "../../../books/pipes/get-author-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextareaResizeDirective} from "../../../shared/directives/text-area-resize.directive";
import {AuthorService} from "../../services/author.service";
import {MyValidatorsService} from "../../../shared/services/my-validators.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DialogConfirmComponent} from "../../../shared/components/dialog-confirm/dialog-confirm.component";
import {CountryService} from "../../services/country.service";
import {IAuthor} from "../../types/IAuthor";
import {MatTooltipModule} from "@angular/material/tooltip";
import {GetCountryNamePipe} from "../../pipes/get-country-name.pipe";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ErrorTextComponent} from "../../../shared/components/error-text/error-text.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-author-create',
  standalone: true,
  imports: [CommonModule, GetAuthorNamePipe, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatListModule, ReactiveFormsModule, TextareaResizeDirective, MatTooltipModule, GetCountryNamePipe, MatDatepickerModule,
    MatDialogModule, MatSelectModule, ErrorTextComponent, TranslateModule
  ],
  templateUrl: './author-create.component.html',
  styleUrls: ['../../../shared/styles/item-create.scss','./author-create.component.scss']
})
export default class AuthorCreateComponent implements OnInit {
  constructor(
    private authorsS: AuthorService,
    private countryS: CountryService,
    private myValidatorsS: MyValidatorsService,
    private destroyRef: DestroyRef,
    private matDialog: MatDialog,
    private router: Router,
    private translateS: TranslateService
  ) {}

  protected authors = this.authorsS.getEntitiesAsync();
  protected countries = this.countryS.getEntitiesAsync();

  protected resetBtnDisabled = signal(true);

  private initialFormState = {
    name: '',
    surname: '',
    patronymic: '',
    countryID: null,
    birthDate: null,
    deathDate: null,
    description: ''
  }

  protected authorForm = new FormGroup({
    name: new FormControl(this.initialFormState.name, [Validators.required, this.myValidatorsS.minLengthTrimValidator(2), this.myValidatorsS.maxLengthTrimValidator(30)]),
    surname: new FormControl(this.initialFormState.surname, [Validators.required, this.myValidatorsS.minLengthTrimValidator(2), this.myValidatorsS.maxLengthTrimValidator(30)]),
    patronymic: new FormControl(this.initialFormState.patronymic),
    countryID: new FormControl(this.initialFormState.countryID, [Validators.required]),
    birthDate: new FormControl(this.initialFormState.birthDate, [Validators.required]),
    deathDate: new FormControl(this.initialFormState.deathDate),
    description: new FormControl(this.initialFormState.description, [this.myValidatorsS.maxLengthTrimValidator(300)])
  });

  ngOnInit(): void {

    this.authorForm.valueChanges
      .pipe(
        debounceTime(300),
        map(value => JSON.stringify(value) === JSON.stringify(this.initialFormState)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => this.resetBtnDisabled.set(value));
  }

  protected createNewAuthor() {
    this.authorsS.addEntity(this.authorForm.value as unknown as IAuthor);
    this.router.navigate(['authors']);
  }
  protected resetForm() {
    this.authorForm.reset(this.initialFormState);
  }

  protected returnToTheAuthorsList() {
    this.matDialog.open(DialogConfirmComponent, {
      data: {
        title: this.translateS.instant('confirm.title.leave'),
        text: this.translateS.instant('confirm.text.unsavedChanges')
      },
      disableClose: true
    }).afterClosed()
      .subscribe(option => {
        if (option) { this.router.navigate(['authors']); }
      })
  }
}
