import { Component, OnInit } from '@angular/core';
import { ChapterService } from '../../chapter.service';
import { LevelService } from '../../level.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Chapter, Level, Vector2 } from '../../../assets/game/level';
import { EditorService } from '../editor.service';
import { EditorState } from '../editor-state.enum';

@Component({
	selector: 'app-chapters',
	templateUrl: './chapters.component.html',
	styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
	chapterId: number;
	chapters: Array<Chapter> = new Array<Chapter>();
	preview: string;
	chapterOpen: Array<boolean> = new Array<boolean>();

	constructor(
		private editorService: EditorService,
		private levelService: LevelService,
		private chapterService: ChapterService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			this.chapterId = +params['idChapter'];
			this.editorService.state = EditorState.chapters;
			this.chapterService.getChapters()
			.subscribe(
				res => {
				res.sort((a, b) => {
					return a.id - b.id;
				});
				this.chapters = res;
				},
				err => {

				}
			);
		});
	}

	newChapter() {
		let chapter = new Chapter(this.chapters.length + 1);
		console.log(chapter);
		this.chapterService.newChapter(chapter)
		.subscribe(res => {
			console.log(res);
			this.chapters.push(res);
		});
	}

	deleteChapter(chapter) {
		if(confirm("Are you sure you want to remove this chapter?")){
			let index = this.chapters.indexOf(chapter);
			this.chapters.splice(index, 1);
			console.log(chapter._id);
			this.chapterService.deleteChapter(chapter._id)
			.subscribe(res => {
				console.log(res);
			});
		}
	}

	newLevel(chapter: Chapter): void {
		this.levelService.newLevel(chapter.levels.length)
		.subscribe(res => {
			console.log(res);
			chapter.levels.push(res);
		});
		// chapter.levels.push(new Level(chapter.levels.length));
	}

	deleteLevel(chapter, level) {
		if(confirm("Are you sure you want to remove this level?")){
			let index = chapter.levels.indexOf(level);
			console.log(index);
			chapter.levels.splice(index, 1);
			this.levelService.deleteLevel(level._id)
			.subscribe(res => {
				console.log(res);
			});
		}
	}

	moveLevel(direction, chapter, level): void {
		direction = direction == 0 ? 1 : Math.min(Math.max(-1, direction), 1);
		let levels = chapter.levels;
		let index = levels.indexOf(level);
		if(index < 0 || index >= levels.length) return
		// level.id += direction;
		chapter.levels.splice(index, 1);
		chapter.levels.splice(index + direction, 0, level);
		this.resetIds(chapter.levels);
	}

	moveChapter(direction, chapter): void {
		direction = direction == 0 ? 1 : Math.min(Math.max(-1, direction), 1);
		let chapters = this.chapters;
		let index = chapters.indexOf(chapter);
		if(index < 0 || index >= chapters.length) return
		chapter.id += direction;
		chapters.splice(index, 1);
		chapters.splice(index + direction, 0, chapter);
		this.resetIds(chapters);
		this.resetChapterOpen();
	}

	resetIds(array) {
		for(let i = 0; i < array.length; i++) {
			array[i].id = i+1;
		}
	}

	rename(chapter: Chapter) {
		let newName = prompt("New chapter title: ");
		if(newName) {
			chapter.title = newName;
		}
	}

	resetChapterOpen() {
		for(let i = 0; i < this.chapterOpen.length; i++) {
			this.chapterOpen[i] = false;
		}
	}

	save() {
		this.chapterService.saveChapters(this.chapters)
		.subscribe(
			res => {
				console.log(res);
			},
			err => {
				console.log(err);
			}
		)

	}
}
