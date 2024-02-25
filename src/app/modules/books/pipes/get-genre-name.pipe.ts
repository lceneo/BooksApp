import { Pipe, PipeTransform } from '@angular/core';
import {GenreService} from "../services/genre.service";

@Pipe({
  name: 'getGenreName',
  standalone: true
})
export class GetGenreNamePipe implements PipeTransform {

  constructor(
    private genreS: GenreService
  ) {}
  transform(genreID: number): string {
    return this.genreS.getEntityByID(genreID)?.name ?? '-';
  }

}
