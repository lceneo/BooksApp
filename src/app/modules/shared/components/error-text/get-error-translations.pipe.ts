import { Pipe, PipeTransform } from '@angular/core';
import {IErrorInst} from "./error-text.component";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'getErrorTranslations',
  standalone: true
})
export class GetErrorTranslationsPipe implements PipeTransform {

  constructor(
      private translateS: TranslateService) {}
  transform(errorNames: IErrorInst[]): string {
    return errorNames.map(err => this.translateS.instant(err.translationPath, err.params))
        .reduce((acc: string, err) => acc += err + ' ;', '').slice(0, -1);
  }

}
