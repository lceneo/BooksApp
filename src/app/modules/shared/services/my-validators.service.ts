import { Injectable } from '@angular/core';
import {AbstractControl} from "@angular/forms";
import {PageLimitType} from "../../books/components/book-filter/book-filter.component";
import {isNill} from "../helpers/helpFn";

@Injectable({
  providedIn: 'root'
})
export class MyValidatorsService {

  constructor() { }


  minLengthTrimValidator(minLength: number) {
    return (control: AbstractControl) => {
      if (isNill(control.value)) { return null; }
      const trimmedControl = control.value.toString().trim();
      return trimmedControl.length >= minLength ? null : { minTrimLength: { requiredLength: minLength} }
    }
  }

  maxLengthTrimValidator(maxLength: number) {
    return (control: AbstractControl) => {
      if (isNill(control.value)) { return null; }
      const trimmedControl = control.value.toString().trim();
      return trimmedControl.length <= maxLength ? null : { maxTrimLength: { requiredLength: maxLength } }
    }
  }
  smallerThanOtherControl(secondControl: AbstractControl<number>, strict = true) {
    return (control: AbstractControl<number>) => {
      if (control.value === undefined) { return null; }
      else if (strict) {
        return control.value < secondControl.value ? null : { biggerOrEqualToOtherControl: true };
      }
      return control.value <= secondControl.value ? null : { biggerThanOtherControl: true };
    }
  }

  biggerThanOtherControl(secondControl: AbstractControl<number>, strict = true) {
    return (control: AbstractControl<number>) => {
      if (control.value === undefined) { return null; }
      else if (strict) {
        return control.value > secondControl.value ? null : { smallerOrEqualToOtherControl: true };
      }
      return control.value >= secondControl.value ? null : { smallerThanOtherControl: true };
    }
  }

  pageLimitValidator(minValue: number, maxValue: number) {
    return (control: AbstractControl<PageLimitType>) =>
    {
      if (!control.value) {
        return null;
      }
      const [minPage, maxPage] = [control.value.minPageCount, control.value.maxPageCount];
      if (!minPage && !maxPage) {
        return null;
      } else if ((!minPage && maxPage) || (minPage && !maxPage)) {
        return null;
      } else if (minPage! < minValue || maxPage! > maxValue) {
        return { pageLimitValidator: {
            minValue, maxValue
          }
        };
      }
      return (minPage as number) <= (maxPage as number) ? null :
          { pageLimitValidator: {
              minValue, maxValue
            }
          };
    }
  }
}
