import { Component, OnInit } from '@angular/core';
import { User } from "./../../lib/user/user";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GameService } from './game.service';
import { GameState } from './game-state.enum';
import { WebComponent } from "./../web/web.component";
import { AuthenticationService } from '../authentication.service';


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    email: string;
    password: string;
    name:string;
    user = null;
    constructor(
        private authenticationService:AuthenticationService,
        public gameService: GameService,
        private router: Router,

    ) { }

    ngOnInit() {
        this.user = this.authenticationService.user;
        this.name = this.user.email;
    }

    login() {
		let newUser = {
			email : this.email,
			password : this.password
		};
		this.authenticationService.login(newUser)
		.subscribe(
			res => {
				this.user = newUser;
				console.log(this.user);
			}
		)
	}
   
    back() {
      
        console.log(this.gameService.state);
        console.log(GameState.LevelSelect);
        console.log(this.gameService.state === GameState.LevelSelect);
        if(this.gameService.state === GameState.LevelSelect) {
          
            this.router.navigate(['/game/chaters']);
           
        }
        else if(this.gameService.state === GameState.Play) {
           
            this.router.navigate(['/game/' + this.gameService.chapter + '/levels']);
            
        }
    }
     backToStages() {
        console.log(this.gameService.chapter);
        if(this.gameService.chapter)
            this.router.navigate(['/game/' + this.gameService.chapter + '/levels']);
        else
            this.router.navigate(['']);
    }
}
