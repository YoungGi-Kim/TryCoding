import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebComponent }    from './web.component';
import { HomeComponent }  from './home/home.component';
import { NewsComponent }  from './news/news.component';
import { AboutComponent }  from './about/about.component';
import { ProfileComponent }  from './profile/profile.component';
import {CBTComponent}from './cbt/cbt.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '',
      component: WebComponent,
      children: [
          { path: '', component: HomeComponent },
          { path: 'news', component: NewsComponent },
          { path: 'about', component: AboutComponent },
          { path: 'profile', component: ProfileComponent },
          { path: 'cbt', component: CBTComponent }
          // { path: 'play', component: PlayComponent }
      ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class WebRoutingModule {}
