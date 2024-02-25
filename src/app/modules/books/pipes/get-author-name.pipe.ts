import { Pipe, PipeTransform } from '@angular/core';
import {AuthorService} from "../../authors/services/author.service";

//needs to be impure to dynamically update name
@Pipe({
  name: 'getAuthorName',
  standalone: true,
  pure: false
})
export class GetAuthorNamePipe implements PipeTransform {

  constructor(
    private authorS: AuthorService
  ) {}
  transform(authorID: number): string {
    const author = this.authorS.getEntityByID(authorID);
    return !author ? '-' :
      `${author.surname} ${author.name} ${author.patronymic ?? ''}`.trimEnd();
  }

}
