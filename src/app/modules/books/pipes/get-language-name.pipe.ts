import { Pipe, PipeTransform } from '@angular/core';
import {LanguageService} from "../services/language.service";

@Pipe({
  name: 'getLanguageName',
  standalone: true
})
export class GetLanguageNamePipe implements PipeTransform {

  constructor(
    private languageS: LanguageService
  ) {}
  transform(languageID: number): string {
    return this.languageS.getEntityByID(languageID)?.name ?? '-';
  }

}
