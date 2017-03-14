import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { AuthenticateComponent } from "./../../authenticate/authenticate.component";
import { AuthenticationService } from '../../authentication.service';
import { WebComponent } from '../web.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @Input('langData') public lang : string;
		@Output() langValue = new EventEmitter();
		user;
    login:boolean = false;
    public translatedText: Array<string> = [];
  	public supportedLanguages: any[];
	
  // public translatedText: Array<string> = Infinity;
    constructor(
      private router: Router,
      private _translate: TranslateService,
			private authenticationService: AuthenticationService,
    ) { 
			this.lang = this._translate.currentLang;
		}

    ngOnInit(){
			this.user = this.authenticationService.user;
      this.supportedLanguages = [
			{display: 'English', value: 'en'},
			{display: 'Korean', value: 'kr'}
		];
		  this.lang = this._translate.currentLang;
			this.selectLang(this.lang);

	  }

    public isCurrentLang(lang: string){
			lang = this._translate.currentLang;
			return lang === this._translate.currentLang;
		
	}

	notLoginAlert(){
		alert("로그인을 한 뒤 다시 시도하십시오.")
	}

	userBoolean(){
		return this.user.email === ''
	}

	public selectLang(lang : string){
		lang = this._translate.currentLang;
		this._translate.use(lang);
		this.refreshText();	
	}

	public refreshText() {
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
		//this.home.translatedText = this.translatedText;
	}

}
