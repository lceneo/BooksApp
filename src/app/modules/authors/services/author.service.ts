import {Injectable, signal, WritableSignal} from '@angular/core';
import {IEntityState} from "../../shared/infrastracture/IEntityState";
import {IAuthor} from "../types/IAuthor";
import {EntityStore} from "../../shared/infrastracture/EntityStore";

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends EntityStore<IAuthor>{

  constructor() {
    super(mockAuthors, 'createdAuthors');
  }


}


//for localStorage implementation only
const mockAuthors: IAuthor[] = [
  { ID: 1, name: 'Mark', surname: 'Twain', birthDate: '1835-11-29T19:57:27.000Z',
    deathDate: '1910-04-20T19:57:27.000Z', countryID: 1 },

  { ID: 2, name: 'Aleksey', surname: 'Tolstoy', patronymic: 'Nikolayevich', birthDate: '1883-01-09T19:57:27.000Z',
    deathDate: '1945-02-22T19:00:00.000Z', countryID: 2 },
]
