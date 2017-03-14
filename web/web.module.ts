import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRoutingModule } from './web-routing.module';
import { WebComponent } from './web.component';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { CBTComponent }from './cbt/cbt.component';
import { TRANSLATION_PROVIDERS } from './translate/translation';
import { TranslatePipe } from './translate/translate.pipe';
import { TranslateService } from './translate/translate.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule, WebRoutingModule, FormsModule, HttpModule
    
  ],
  declarations: [
      WebComponent,
      NewsComponent,
      AboutComponent,
      HomeComponent,
      CBTComponent,
      ProfileComponent,
      
  ],
  providers: [
    TRANSLATION_PROVIDERS,
		TranslateService,
  ]
})
export class WebModule { 
  maxstage:number;
  
  onstart(curstage:number){
    this.maxstage=curstage;
  }

  
}
