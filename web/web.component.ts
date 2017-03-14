import { Component, OnInit, EventEmitter, Input, ViewChild } from '@angular/core';
import { User } from "./../../lib/user/user";
import { Http, Headers } from '@angular/http';
import { AuthenticationService } from '../authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from "./home/home.component";
import { TranslateService } from './translate/translate.service';

@Component({
	selector: 'app-web',
	templateUrl: './web.component.html',
	styleUrls: ['./web.component.css'],
})
export class WebComponent implements OnInit {
	lang : string;
	navColor;
	user = null;
	display;
	opacity;
	email: string;
	country: string;
	dateOfBirth;
	firstname: string;
	lastname: string;
	password: string;
	passwordConfirm: string;
	username: string;
	logedin:boolean; 
	loginview:boolean = true;
	openLogin:boolean;
	languageHidden:boolean = false;
	public translatedText: Array<string> = [];
	public supportedLanguages: any[];

	constructor(
		private authenticationService:AuthenticationService,
		private router: Router,
		private _translate: TranslateService,
	
	) {
	
	}

	languageConvert(){
		this.languageHidden = !this.languageHidden;
	}

	toggleLogin() {
		this.openLogin = !this.openLogin;
	}

	ngOnInit() {
		this.user = this.authenticationService.user;
		this.navColor = document.getElementById("navigation-bar");
		this.listen();
		this.authenticationService.updateUser.subscribe((user) => {
			this.user = user;
			console.log(user);
		})
		this.supportedLanguages = [
			{display: 'English', value: 'en'},
			{display: 'Korean', value: 'kr'},
		];

		this._translate.lang = this.lang;
		this.selectLang('en');
		
	}

	isCurrentLang(lang: string){
		
		return lang === this._translate.currentLang;
	}

	selectLang(lang : string){
		
		this._translate.use(lang);
		this.refreshText();
		
	}

	changelang(){
		this._translate.lang = this.lang;
	}

	refreshText() {
		this.translatedText[0] = this._translate.instant('register');
		this.translatedText[1] = this._translate.instant('Username');
		this.translatedText[2] = this._translate.instant('Firstname');
		this.translatedText[3] = this._translate.instant('Lastname');
		this.translatedText[4] = this._translate.instant('Password');
		this.translatedText[5] = this._translate.instant('PasswordConfirm');
		this.translatedText[6] = this._translate.instant('Country');
		this.translatedText[7] = this._translate.instant('Email');
		this.translatedText[8] = this._translate.instant('Referral')
		this.translatedText[9] = this._translate.instant('title');
		this.translatedText[10] = this._translate.instant('titledetail');
		this.translatedText[11] = this._translate.instant('latestnews');
		this.translatedText[12] = this._translate.instant('realcode');
		this.translatedText[13] = this._translate.instant('realcodedetail');
		this.translatedText[14] = this._translate.instant('funenvironment');
		this.translatedText[15] = this._translate.instant('funenvironmentdetail');
		this.translatedText[16] = this._translate.instant('welcomeTrycoding');
		this.translatedText[17] = this._translate.instant('welcomdetail');
		this.translatedText[18] = this._translate.instant('suvive');
		this.translatedText[19] = this._translate.instant('suvivedetail');
		this.translatedText[20] = this._translate.instant('chrPro');
		this.translatedText[21] = this._translate.instant('chrProdetail');
		this.translatedText[22] = this._translate.instant('hope');
		this.translatedText[23] = this._translate.instant('hopedetail');
		this.translatedText[24] = this._translate.instant('offerjoin');
		this.translatedText[25] = this._translate.instant('offerjoindetail');
		this.translatedText[26] = this._translate.instant('login');
		//this.home.translatedText = this.translatedText;
		console.log(this.translatedText[0]);
	}

	listen() {
		window.addEventListener("scroll", (e) => {
			if(window.pageYOffset > 100){
				this.navColor.style.backgroundColor = "rgba(22,27,33,0.6)";
			}else{
				this.navColor.style.backgroundColor = "rgba(22,27,33,0.0)";
			}
		});
	}

	register() {
		let dateOfBirth = this.dateOfBirth.split("/");
		let newUser = {
			username: this.username,
			firstname: this.firstname,
			lastname: this.lastname,
			dateOfBirth: new Date(this.dateOfBirth),
			country: this.country,
			email: this.email,
			password: this.password,
			passwordConfirm: this.passwordConfirm
		}
		console.log(newUser.dateOfBirth);
		this.authenticationService.register(newUser)
		.subscribe(
			res => {
				// this.openLogin = false;
				// this.user = res;
				this.openLogin = false;
				this.loginview = !this.loginview;
			}
		)
	}

	login() {
		let newUser = {
			email : this.email,
			password : this.password
		};
		this.authenticationService.login(newUser)
		.subscribe(
			res => {
				console.log(res);
				this.openLogin = false;
				this.user = newUser;
				console.log(this.user);
			}
		)
		
	}

	reloadWindow(){
		location.reload();
	}

	toggleLoginView(){
		this.loginview = !this.loginview;
	}

	loginFacebook() {
		location.href =  'http://localhost:4200/api/auth/facebook';
	}

	loginGoogle() {
		location.href =  'http://localhost:4200/api/auth/google';
	}
}
