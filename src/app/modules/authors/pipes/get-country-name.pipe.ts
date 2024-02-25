import { Pipe, PipeTransform } from '@angular/core';
import {CountryService} from "../services/country.service";

@Pipe({
  name: 'getCountryName',
  standalone: true
})
export class GetCountryNamePipe implements PipeTransform {

  constructor(
    private countryS: CountryService
  ) {}
  transform(countryID: number): string {
    return this.countryS.getEntityByID(countryID)?.name ?? '-';
  }

}
