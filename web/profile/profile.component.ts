import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';
import { GameService } from '../../game/game.service';
import {WebModule}from '../web.module';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	user;
  temp:string
  curstageClan:number;
WebModule:WebModule;
  constructor(
	  private router: Router,
    private GameService:GameService,
	  private authenticationService: AuthenticationService,
    
  ) { }

  ngOnInit() {
	  this.user = this.authenticationService.user;
    this.temp = btoa(this.user.country);
    this.temp = this.utf8tob(this.temp);
    console.log(this.temp);
  }

  utf8tob(str: string){
    str = decodeURI(str);
    str = decodeURI(str)
    return str;
  }

  logout() {
	  this.authenticationService.logout();
		this.router.navigate(['/']);
    location.reload();
  }
  chapter(){
   
  }
}
