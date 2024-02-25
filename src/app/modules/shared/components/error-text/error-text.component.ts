import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValidationErrors} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {TranslateService} from "@ngx-translate/core";
import {tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GetErrorTranslationsPipe} from "./get-error-translations.pipe";
import {NgLetDirective} from "../../directives/ng-let.directive";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-error-text',
  standalone: true,
  imports: [CommonModule, MatInputModule, GetErrorTranslationsPipe, NgLetDirective, MatTooltipModule],
  templateUrl: './error-text.component.html',
  styleUrls: ['./error-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorTextComponent implements OnInit{

  constructor(
      private translateS: TranslateService,
      private cdr: ChangeDetectorRef,
      private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.translateS.onLangChange.pipe(
        tap(() => this.cdr.markForCheck()),
        takeUntilDestroyed(this.destroyRef)
    )
        .subscribe(() => this.errorsText = [...this.errorsText]);
  }
  @Input() set errors (errors: ValidationErrors | null) {
    if (!errors) { return; }
    this.errorsText = [];
    console.log(errors)
    Object.entries(errors).forEach(([key, error]) => {
      switch (key){
        case 'required':
          this.errorsText.push({translationPath: 'errors.required'});
          break;
        case 'min':
          this.errorsText.push({translationPath: 'errors.min', params: {actualLength: error.min}});
          break;
        case 'max':
          this.errorsText.push({translationPath: 'errors.max', params: {maxLength: error.max}});
          break;
        case 'minTrimLength':
          this.errorsText.push({translationPath: `errors.minTrimLength`, params: {
              minLength: error.requiredLength
            }});
          break;
        case 'maxTrimLength':
          this.errorsText.push({translationPath:`errors.maxTrimLength`, params: {
              maxLength: error.requiredLength
            }});
          break;
        case 'biggerOrEqualToOtherControl':
          this.errorsText.push({translationPath:`errors.biggerOrEqualToOtherControl`});
          break;
        case 'biggerThanOtherControl':
          this.errorsText.push({translationPath:`errors.biggerThanOtherControl`});
          break;
        case 'smallerOrEqualToOtherControl':
          this.errorsText.push({translationPath:`errors.smallerOrEqualToOtherControl`});
          break;
        case 'smallerThanOtherControl':
          this.errorsText.push({translationPath:`errors.smallerThanOtherControl`});
          break;
        case 'incorrectPageLimit':
          this.errorsText.push({translationPath:`errors.incorrectPageLimit`, params: { minValue: error.minValue, maxValue: error.maxValue }});
          break;
      }
    })
  }

  protected errorsText: IErrorInst[] = [];
}

export interface IErrorInst {
  translationPath: string;
  params?: {
    [p: string] : any
  }
}
