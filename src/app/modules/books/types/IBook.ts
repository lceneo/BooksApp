
export interface IBook {
  ID: number;
  title: string;
  publicationYear: number;
  pagesNumber: number;
  authorID: number;
  description: string;
  // was only made with id because of the DB implementation
  languageID: number;
  genreID: number
}
