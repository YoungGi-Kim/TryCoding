import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
import { ChapterService } from '../../chapter.service';
import { GameState } from './../game-state.enum';
import Objective from '../../../assets/game/objectives/objective'

@Component({
	selector: 'app-chapters',
	templateUrl: './chapters.component.html',
	styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
	chapters: Array<Object>;
	gallery;
	levels:Objective;
	audio;
	constructor(
		private router: Router,
		private gameService: GameService,
		private chapterService: ChapterService
	) {}

	ngOnInit() {
		this.gallery = document.getElementById("chapters");
		// console.log(this.gallery);
		this.audio = new Audio();
		this.audio.src = "./../../../assets/game/assets/Sound/TryCoding_Audio_Sources/BGM/mp3/TryCoding_map.mp3"
		this.audio.load();
		this.audio.play();
		this.gameService.state = GameState.ChapterSelect;
		
		this.chapterService.getChapters()
		.subscribe(
			res => {
				for (let i = 0; i < res.length; i++) {
					console.log(res[i])
				}
				res.sort((a, b) => {
					return a.id - b.id;
				});
				this.chapters = res;
				console.log(this.chapters);
			},
			err => {
				console.error(err);
			}
		);
	}

	selectChapter(chapter: number) {
		this.audio.pause();
		this.gameService.chapter = chapter;
		this.router.navigate(['/game/' + chapter + '/levels']);
	}

	mouseWheelUpFunc(event) {
		
		let delta = event.event.deltaY*1;
		event.el.scrollLeft += (delta * 1);
	}

	mouseWheelDownFunc(event) {
		let delta = event.event.deltaY*1;
		event.el.scrollLeft += (delta * 1);
	}
}
