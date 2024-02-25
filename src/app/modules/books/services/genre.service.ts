import { Injectable } from '@angular/core';
import {EntityStore} from "../../shared/infrastracture/EntityStore";
import {IGenre} from "../types/IGenre";

@Injectable({
  providedIn: 'root'
})
export class GenreService extends EntityStore<IGenre> {

  constructor() {
    super(mockGenres);
  }
}

const mockGenres: IGenre[] = [
  { ID: 1, name: 'Adventure' },
  { ID: 2, name: 'Fairy tale' }
]
