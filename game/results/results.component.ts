import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
import { GameState } from './../game-state.enum';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
maxlevel:number;
    constructor(
        private router: Router,
        public gameService: GameService
    ) { }

    ngOnInit() {
        this.maxlevel=1;
        this.gameService.changeState(GameState.Results);
    }

    backToStages() {
        console.log(this.gameService.chapter);
        if(this.gameService.chapter)
            this.router.navigate(['/game/' + this.gameService.chapter + '/levels']);
        else
            this.router.navigate(['']);
    }
    reTrunGame() {
        console.log(this.gameService.chapter);
        if(this.gameService.chapter)
            this.router.navigate(['/game/' + this.gameService.chapter + '/'+this.gameService.level+'/play']);
        else
            this.router.navigate(['']);
    }
     continue() {
        console.log(this.gameService.chapter);
        if(this.gameService.chapter)
            this.router.navigate(['/game/' + this.gameService.chapter + '/'+(this.gameService.level+this.maxlevel)+'/play']);
        else
            this.router.navigate(['']);
    }
   
}
