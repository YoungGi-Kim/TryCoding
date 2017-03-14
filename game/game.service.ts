import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import { GameState } from './game-state.enum';
import { data } from './data';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../environments/environment'
import ObjectiveManager from '../../assets/game/objective-manager';
import Objective from '../../assets/game/objectives/objective';

@Injectable()
export class GameService {
    state: GameState = 0;
    levelComplete: EventEmitter<any> = new EventEmitter();
    chapter: number;
    level: number;
    chapters;
	objectives: Array<Objective> = null;

    constructor(
        private http: Http,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.chapters = data;
    }

    getTiles() {
        // return this.http.get(this.baseUrl + '/assets/game/tiles.json')
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let result = this.http.get('http://localhost:4200/assets/game/assets/tiles.json', headers)
        .map(res => res.json());
        // .catch(this.handleErrr);
        return result;
        // .map(res => res.json());
        // .map((res:Response) => res.json());
        // .catch(#<{(| this.handleError |)}>#);
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    // getChapters() {
    //     let headers = new Headers();
    //     headers.append('content-type', ' application/json');
    //     return this.http.get(environment.baseUrl + '/chapters', headers)
    //     .map(res => res.json())
    // }
	//
    // getChapter(chapter: number) {
    //     let headers = new Headers();
    //     headers.append('content-type', ' application/json');
    //     return this.http.get(environment.baseUrl + '/chapter/' + chapter, headers)
    //     .map(res => res.json())
    // }
	//
    // getLevel(chapter: number, level: number) {
    //     let headers = new Headers();
    //     headers.append('content-type', ' application/json');
    //     return this.http.get(environment.baseUrl + '/chapter/' + chapter + '/level/' + level, headers)
    //     .map(res => res.json())
    // }

    changeState(newState: GameState) {
        this.state = newState;
    }
}
