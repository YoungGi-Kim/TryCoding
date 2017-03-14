import { Component, OnInit, EventEmitter } from '@angular/core';
import * as ace from 'brace';
import 'brace/mode/javascript';
import '../../../assets/js/trycoding';
import LevelGeneration from '../../../assets/game/level-generation';
import { GameService } from './../game.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GameState } from './../game-state.enum';
import ProccessCode from '../../../lib/utils/proccess-code';
import ObjectiveManager from '../../../assets/game/objective-manager';
import Objective from '../../../assets/game/objectives/objective';
import { LevelService } from '../../level.service'
import { Vector2 } from '../../../assets/game/level';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
    game: Phaser.Game;
    zoom: number = 100;
    fontzoom: number = 15;
    Vector2 : Vector2;
    editor;
    subscription: EventEmitter<any>;
    selectedChapter: number;
    selectedLevel: number;
    gameWidth : number;
    gameHeight : number;
	objectives: Array<Objective> = null;

    constructor(
        public gameService: GameService,
        private route: ActivatedRoute,
        private router: Router,
		private levelService: LevelService
    ) {}

    ngOnInit() {
		this.gameService.changeState(GameState.Play);
		this.route.params.forEach((params: Params) => {
			this.gameService.chapter = +params['idChapter'];
			this.gameService.level = +params['idLevel'];
			this.selectedChapter = this.gameService.chapter;
			this.selectedLevel = this.gameService.level;
			this.editor = ace.edit('editor');
			this.editor.getSession().setMode('ace/mode/javascript');
			this.editor.setTheme('ace/theme/trycoding');
			// this.editor.setTheme('ace/theme/trycoding');
			this.editor.getSession().setUseWrapMode(true);
			this.editor.setShowPrintMargin(false);
			this.createPaserInstance();
		});
    }

    submitCode() {
        var code = this.editor.getValue();;
        this.game.state.states[Object.keys(this.game.state.states)[0]].submitCode(code);
    }

    createPaserInstance() {
        this.levelService.getLevel(this.gameService.chapter, this.gameService.level)

        .subscribe(
            res => {
				console.log(res);
				let level = res;
				console.log(level);
				level.levelData.prefill = ProccessCode.stringToCode(level.levelData.prefill);
				level.levelData.solution = ProccessCode.stringToCode(level.levelData.solution);
				this.editor.insert(level.levelData.prefill);
				this.gameWidth = document.getElementById('game').offsetWidth;
				this.gameHeight = document.getElementById('game').offsetHeight;
				this.game = new Phaser.Game(this.gameWidth, this.gameHeight, Phaser.CANVAS, 'gameContainer', null);
				this.game.state.add('main', new LevelGeneration(this.gameService, level));
				this.game.state.start('main');
				this.subscription = this.gameService.levelComplete.subscribe(item => this.onStageComplete(item));
				this.objectives = this.gameService.objectives;
            },
            error => {
                console.error(error.text());
            }
        );
    }

    onStageComplete(item) {
        this.router.navigate(['/game/results']);
    }

    increase(){
        //this.level.gameElement = new Vector2(document.getElementById('game').offsetWidth * 1.1, document.getElementById('game').offsetHeight * 1.1);
        this.zoom = this.zoom + 10;
        document.getElementById('game').style.zoom = this.zoom.toString() + "%";
    }
    decrease(){
        this.zoom = this.zoom - 10;
        document.getElementById('game').style.zoom = this.zoom.toString() + "%";
    }

    fontincrease(){
        if(this.fontzoom < 30){
            this.fontzoom = this.fontzoom + 1;
        }
        this.editor.setFontSize(this.fontzoom);
    }

    fontdecrease(){
        if(this.fontzoom > 14){
            this.fontzoom = this.fontzoom - 1;
        }
        this.editor.setFontSize(this.fontzoom);
    }
            
}
