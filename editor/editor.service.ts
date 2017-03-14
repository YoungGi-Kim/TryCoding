import { Injectable } from '@angular/core';
import { EditorState } from './editor-state.enum';

@Injectable()
export class EditorService {
	state: EditorState = 1;

  constructor() { }

}
