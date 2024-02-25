import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule, Validators
} from "@angular/forms";
import {PageLimitType} from "../../../books/components/book-filter/book-filter.component";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {debounceTime, map, merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MyValidatorsService} from "../../services/my-validators.service";
import {ErrorTextComponent} from "../error-text/error-text.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-mat-slider-wrapper',
  standalone: true,
  imports: [CommonModule, MatSliderModule, FormsModule, MatInputModule, ReactiveFormsModule, ErrorTextComponent, TranslateModule],
  templateUrl: './mat-slider-wrapper.component.html',
  styleUrls: ['./mat-slider-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSliderWrapperComponent),
      multi: true
    }
  ]
})
export class MatSliderWrapperComponent implements OnInit, ControlValueAccessor{

  @Input({required: true}) minValue?: number;
  @Input({required: true}) maxValue?: number;
  @Input() step?: number;

  constructor(
    private myValidatorsS: MyValidatorsService,
    private destroyRef: DestroyRef
  ) {}

  private onChangeFn?: (value: PageLimitType) => void;
  private onTouched?: () => void;


  protected currentFromValue?: FormControl<number | undefined>;
  protected currentToValue?: FormControl<number | undefined>;


  ngOnInit(): void {
    this.setupControls();
  }

  private setupControls() {
    this.currentFromValue = new FormControl(this.minValue) as FormControl<number>;
    this.currentToValue = new FormControl(this.maxValue) as FormControl<number>;

    //setting validators here cause controls weren't initialised before
    this.currentFromValue.setValidators([Validators.min(this.minValue!),
      this.myValidatorsS.smallerThanOtherControl(this.currentToValue as AbstractControl, false)]);

    this.currentToValue.setValidators([Validators.max(this.maxValue!),
      this.myValidatorsS.biggerThanOtherControl(this.currentFromValue as AbstractControl, false)]);


    merge(
      this.currentFromValue.valueChanges,
      this.currentToValue.valueChanges
    ).pipe(
      debounceTime(50), //only 50 due-to the possible enter spam
      map(() => ({ minPageCount: this.currentFromValue?.value ?? this.minValue, maxPageCount: this.currentToValue?.value ?? this.maxValue} as PageLimitType)),
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe(pageLimit =>
        this.onChangeFn!(pageLimit));
  }
  protected handleBlur() {
    this.onTouched && this.onTouched();
  }
  registerOnChange(fn: (value: PageLimitType) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(pageLimit: PageLimitType): void {
    this.currentFromValue?.setValue(pageLimit?.minPageCount ?? this.minValue);
    this.currentToValue?.setValue(pageLimit?.maxPageCount ?? this.maxValue);
  }

}
