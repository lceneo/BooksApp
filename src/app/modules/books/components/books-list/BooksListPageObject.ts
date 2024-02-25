import {PageObjectBase} from "../../../shared/helpers/PageObjectBase";

export class BooksListPageObject extends PageObjectBase {
  constructor(root: HTMLDivElement) {
    super(root)
  }


  getBooksElementsList() {
    return this.root.querySelectorAll('.items__item');
  }

  isEmpty() {
    return !this.getBooksElementsList().length && !!this.root.querySelector('.items__list-empty');
  }
}
