import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Components
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CustomizerComponent } from './components/customizer/customizer.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/layout/content/content.component';
import { FullComponent } from './components/layout/full/full.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';
// Header Elements Components
import { SearchComponent } from './components/header/elements/search/search.component';
import { MegaMenuComponent } from './components/header/elements/mega-menu/mega-menu.component';
import { LanguagesComponent } from './components/header/elements/languages/languages.component';
import { NotificationComponent } from './components/header/elements/notification/notification.component';
import { BookmarkComponent } from './components/header/elements/bookmark/bookmark.component';
import { CartComponent } from './components/header/elements/cart/cart.component';
import { MessageBoxComponent } from './components/header/elements/message-box/message-box.component';
import { MyAccountComponent } from './components/header/elements/my-account/my-account.component';
// Directives
import { DisableKeyPressDirective } from './directives/disable-key-press.directive';
import { OnlyAlphabetsDirective } from './directives/only-alphabets.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ShowOptionsDirective } from './directives/show-options.directive';
import { ContactNoDirective } from './directives/contactno.directive';

import { LayoutService } from './services/layout.service';
import { NavService } from './services/nav.service';
import { SafePipe } from "./directives/safepipe";
import { SafeHtmlPipe } from "./directives/safehtml";
import { NumberWithDecimalDirective } from './directives/number-with-decimal.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    CustomizerComponent,
    FeatherIconsComponent,
    FullComponent,
    ShowOptionsDirective,
    DisableKeyPressDirective,
    OnlyAlphabetsDirective,
    ContactNoDirective,
    OnlyNumbersDirective,
    LoaderComponent,
    TapToTopComponent,
    SearchComponent,
    MegaMenuComponent,
    LanguagesComponent,
    NotificationComponent,
    BookmarkComponent,
    CartComponent,
    MessageBoxComponent,
    MyAccountComponent,
    SafePipe,
    SafeHtmlPipe,
    NumberWithDecimalDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    // DragulaModule.forRoot(),
    // TranslateModule
  ],
  providers: [
    NavService,
    // ChatService,
    LayoutService
  ],
  exports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    // TranslateModule,
    LoaderComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    TapToTopComponent,
    DisableKeyPressDirective,
    OnlyAlphabetsDirective,
    OnlyNumbersDirective,
    ContactNoDirective,
    SafePipe,
    SafeHtmlPipe,
    NumberWithDecimalDirective
  ],
})
export class SharedModule { }
