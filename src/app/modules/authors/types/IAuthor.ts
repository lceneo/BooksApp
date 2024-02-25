
export interface IAuthor {
  ID: number;
  name: string;
  surname: string;
  patronymic?: string;
  countryID: number;
  birthDate: string;
  deathDate?: string;
  description?: string;
}
