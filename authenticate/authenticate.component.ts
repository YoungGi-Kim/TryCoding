import { Component, OnInit } from '@angular/core';
import { User } from "./../../lib/user/user";
import { AuthenticationService } from '../authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-authenticate',
	templateUrl: './authenticate.component.html',
	styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

	constructor(
        private router: Router,
		private route: ActivatedRoute,
		private authenticationService: AuthenticationService
	) { }

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let jwt = "JWT ";
			jwt += params['jwt'];
			//this.authenticationService.socialLogin(jwt);
			console.log(jwt);
			this.authenticationService.login(jwt);
			this.router.navigate(['/']);
		});
	}

	locallogin(){
		this.route.params.forEach((params: Params) => {
			let jwt = "JWT ";
			jwt += params['jwt'];
			//this.authenticationService.socialLogin(jwt);
			this.authenticationService.login(User);
			this.router.navigate(['/']);
		});
	}

	sociallogin(){
		this.route.params.forEach((params: Params) => {
			let jwt = "JWT ";
			jwt += params['jwt'];
			this.authenticationService.socialLogin(jwt);
			//this.authenticationService.login(jwt);
			this.router.navigate(['/']);
		});
	}
}
