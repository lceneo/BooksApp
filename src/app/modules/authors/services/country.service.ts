import { Injectable } from '@angular/core';
import {EntityStore} from "../../shared/infrastracture/EntityStore";
import {ICountry} from "../types/ICountry";

@Injectable({
  providedIn: 'root'
})
export class CountryService extends EntityStore<ICountry>{

  constructor() {
    super(mockCountries);
  }
}

const mockCountries: ICountry[] = [
  { ID: 1, name: 'USA' },
  { ID: 2, name: 'Russia' }
]
