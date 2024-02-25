import { Injectable } from '@angular/core';
import {EntityStore} from "../../shared/infrastracture/EntityStore";
import {ILanguage} from "../types/ILanguage";

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends EntityStore<ILanguage>{

  constructor() {
    super(mockLanguages)
  }
}

const mockLanguages: ILanguage[] = [
  { ID: 1, name: 'English'},
  { ID: 2, name: 'Russian' }
]
