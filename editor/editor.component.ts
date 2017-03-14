import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EditorService } from './editor.service';
import { EditorState } from './editor-state.enum';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(
	  private route: ActivatedRoute,
	  private router: Router,
	  private editorService: EditorService
  ) { }

  ngOnInit() {
  }

  back() {
	  console.log(this.editorService.state);
	  if(this.editorService.state === EditorState.assetManager || this.editorService.state === EditorState.level) {
		  this.router.navigate(['/editor/chapters']);
	  }
	  else if(this.editorService.state === EditorState.chapters || this.editorService.state === EditorState.chapter) {
		  console.log('etst');
		  this.router.navigate(['/']);
	  }
  }
}
