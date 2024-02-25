import {Injectable} from '@angular/core';
import {IBook} from "../types/IBook";
import {EntityStore} from "../../shared/infrastracture/EntityStore";

@Injectable({
  providedIn: 'root'
})
export class BookService extends EntityStore<IBook>{

  constructor() {
    super(mockBooks, 'createdBooks');
  }
}

//for localStorage implementation only
export const mockBooks: IBook[] = [
  { ID: 1, title: 'The Adventures of Tom Sawyer' ,authorID: 1, genreID: 1, languageID: 1, pagesNumber: 632, publicationYear: 1876,
  description: 'The Adventures of Tom Sawyer (also simply known as Tom Sawyer) is an 1876 novel by Mark Twain about a boy growing' +
    ' up along the Mississippi River. It is set in the 1840\'s in the town of St. Petersburg, which is based on Hannibal, Missouri,' +
    ' where Twain lived as a boy.'
  },
  { ID: 2, title: 'The Golden Key' ,authorID: 2, genreID: 2, languageID: 2, pagesNumber: 342, publicationYear: 1936,
    description: 'a fairy tale story by Soviet writer Alexei Tolstoy, which is a literary treatment of Carlo Collodi\'s' +
      ' tale The Adventures of Pinocchio. The Story of the Wooden Doll. Tolstoy dedicated the book to his future fourth and' +
      ' last wife, Lyudmila Krestinskaya.' },
]
