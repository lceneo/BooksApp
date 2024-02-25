import { Pipe, PipeTransform } from '@angular/core';
import {IBook} from "../types/IBook";
import {IFilter} from "../components/book-filter/book-filter.component";

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(books: IBook[], filter: IFilter): IBook[] {
    return !filter ? books :
        books.filter(book => {
                return (!filter.searchString || `${book.title}${book.description}`.toLowerCase().replace(/\s+/g, '').includes(filter.searchString)) &&
                    (!filter.authorsIDs?.length || filter.authorsIDs.includes(book.authorID)) &&
                    (!filter.languagesIDs?.length || filter.languagesIDs.includes(book.languageID)) &&
                    (!filter.genreID || filter.genreID === book.genreID) &&
                    (!filter.pageLimit || !Object.keys(filter.pageLimit).length
                        || ((filter.pageLimit.minPageCount ?? 0) <= book.pagesNumber && (filter.pageLimit.maxPageCount ?? Number.MAX_SAFE_INTEGER) >= book.pagesNumber));
            }
          )
        }
  }
