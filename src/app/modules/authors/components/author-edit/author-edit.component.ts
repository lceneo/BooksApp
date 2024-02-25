import {ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {AuthorService} from "../../services/author.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IAuthor} from "../../types/IAuthor";
import {MyValidatorsService} from "../../../shared/services/my-validators.service";
import {GetCountryNamePipe} from "../../pipes/get-country-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {TextareaResizeDirective} from "../../../shared/directives/text-area-resize.directive";
import {CountryService} from "../../services/country.service";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ErrorTextComponent} from "../../../shared/components/error-text/error-text.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-author-edit',
  standalone: true,
  imports: [CommonModule, MatDialogModule, GetCountryNamePipe, MatButtonModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatSelectModule,
    ReactiveFormsModule, TextareaResizeDirective, MatDatepickerModule, ErrorTextComponent, TranslateModule],
  templateUrl: './author-edit.component.html',
  styleUrls: ['../../../shared/styles/item-create.scss', './author-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorEditComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IAuthorEditData,
    private matdialogRef: MatDialogRef<IAuthorEditData>,
    private myValidatorsS: MyValidatorsService,
    private authorsS: AuthorService,
    private countryS: CountryService,
    private destroyRef: DestroyRef
  ) {}

  protected author = this.authorsS.getEntityByID(this.data.authorID) as IAuthor;
  protected countries = this.countryS.getEntitiesAsync();
  protected resetBtnDisabled = signal(true);

  protected editForm = new FormGroup({
    name: new FormControl(this.author.name, [Validators.required, this.myValidatorsS.minLengthTrimValidator(2),
      this.myValidatorsS.maxLengthTrimValidator(30)]),
    surname: new FormControl(this.author.surname, [Validators.required, this.myValidatorsS.minLengthTrimValidator(2),
      this.myValidatorsS.maxLengthTrimValidator(30)]),
    patronymic: new FormControl(this.author.patronymic),
    countryID: new FormControl(this.author.countryID, [Validators.required]),
    birthDate: new FormControl(this.author.birthDate, [Validators.required]),
    deathDate: new FormControl(this.author.deathDate),
    description: new FormControl(this.author.description, [this.myValidatorsS.maxLengthTrimValidator(300)])
  });

  ngOnInit(): void {
    this.editForm.valueChanges
      .pipe(
        debounceTime(300),
        map(value => {
          const formValue = this.editForm.value as Partial<IAuthor>;
          return !Object.keys(formValue)
            .find(key => formValue[key as keyof IAuthor] !== this.author[key as keyof IAuthor])
        }),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(value => this.resetBtnDisabled.set(value));
  }

  updateAuthor() {
    this.authorsS.updateEntity(this.author.ID, this.editForm.value as Partial<IAuthor>);
    this.matdialogRef.close();
  }
}

interface IAuthorEditData {
  authorID: number
}
