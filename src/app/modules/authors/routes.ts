import {Routes} from "@angular/router";

export default [
  { path: '', loadComponent: () => import('./components/authors-list/authors-list.component')  },
  { path: 'create', loadComponent: () => import('./components/author-create/author-create.component')  }
] satisfies Routes;
