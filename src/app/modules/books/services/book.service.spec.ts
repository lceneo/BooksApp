import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {BookService, mockBooks} from './book.service';
import {IBook} from "../types/IBook";

describe('BookServiceService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    service.clearStore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly innit books', () => {
    const books = service.getEntities();
    expect(books.length).toBe(0);
  })

  it('should add book', () => {
    const newBook: Omit<IBook, 'ID'> = {
      title: 'TestTile', genreID: 1, languageID: 1,
      pagesNumber: 10, authorID: 1, description: 'TestDescription',
      publicationYear: 2004
    };
    service.addEntity(newBook);
    const books = service.getEntities();
    expect(books.length).toBe(1);
    expect(books[0].ID).toBe(1);
  })

  it('should correctly update book', () => {
    const newBook: Omit<IBook, 'ID'> = {
      title: 'TestTile', genreID: 1, languageID: 1,
      pagesNumber: 10, authorID: 1, description: 'TestDescription',
      publicationYear: 2004
    };
    service.addEntity(newBook);
    const bookToUpdate = service.getEntities()[0];
    service.updateEntity(bookToUpdate.ID, {description: 'New Description'});
    const updatedBook = service.getEntityByID(bookToUpdate.ID);
    expect(updatedBook?.description).toBe('New Description')
  });

  it('should asynchronously update', fakeAsync(() => {
    const booksSignal = service.getEntitiesAsync();
    expect(booksSignal().length).toBe(0);

    setTimeout(() => {
      const newBook: Omit<IBook, 'ID'> = { 
        title: 'TestTile', genreID: 1, languageID: 1,
        pagesNumber: 10, authorID: 1, description: 'TestDescription',
        publicationYear: 2004
      };
      service.addEntity(newBook)
    }, 5000);

    tick(5000);
    expect(booksSignal().length).toBe(1);
  }))
});
