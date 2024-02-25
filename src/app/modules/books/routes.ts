import {Routes} from "@angular/router";

export default [
  { path: '', loadComponent: () => import('./components/books-list/books-list.component')  },
  { path: 'create', loadComponent: () => import('./components/book-create/book-create.component') },
  { path: ':id', loadComponent: () => import('./components/book-item/book-item.component') }
] satisfies Routes;
