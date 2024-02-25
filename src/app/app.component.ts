import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {iconsList} from "../assets/icons/icons-list";
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLinkActive,
    MatMenuModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  standalone: true
})
export class AppComponent {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translateS: TranslateService
  ) {
    this.registerCustomIcons();
    this.registerLanguages();
  }

  protected currentLang: LangType = 'ru';

  @HostListener("window:beforeunload")
  private saveSettings(){
    localStorage.setItem('saved-lang', this.translateS.currentLang)
  }
  private registerCustomIcons() {
    iconsList.forEach(iconName => {
      this.matIconRegistry.addSvgIcon(iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/${iconName}.svg`));
    })
  }

  private registerLanguages() {
    this.translateS.addLangs(['en', 'ru']);
    // no sense in unsubscribing cause this sub lives during whole app lifecycle
    this.translateS.onLangChange
        .subscribe(langEv => this.currentLang = langEv.lang as LangType);
    const savedLang = localStorage.getItem('saved-lang');
    if (savedLang) { this.translateS.use(savedLang) }
    else { this.translateS.use(this.translateS.defaultLang)}
  }

  protected changeLanguage(language: string){
    if (language === this.translateS.currentLang) { return; }
    this.translateS.use(language);
  }

}


type LangType = 'ru' | 'en';
