import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter, Routes} from "@angular/router";
import { provideAnimations } from '@angular/platform-browser/animations';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {importProvidersFrom} from "@angular/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books'},
  { path: 'books', title: 'Books', loadChildren: () => import('./app/modules/books/routes')},
  { path: 'authors', title: 'Authors',  loadChildren: () => import('./app/modules/authors/routes')},
  { path: '**', loadComponent: () => import('./app/modules/shared/components/not-found/not-found.component')}
]


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      },
      defaultLanguage: 'ru'
    })),
    importProvidersFrom(MatNativeDateModule),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
]
});
