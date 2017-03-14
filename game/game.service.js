"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
var data_1 = require("./data");
var GameService = (function () {
    function GameService(http, route, router) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.state = 0;
        this.levelComplete = new core_1.EventEmitter();
        this.objectives = null;
        this.chapters = data_1.data;
    }
    GameService.prototype.getTiles = function () {
        // return this.http.get(this.baseUrl + '/assets/game/tiles.json')
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var result = this.http.get('http://localhost:4200/assets/game/assets/tiles.json', headers)
            .map(function (res) { return res.json(); });
        // .catch(this.handleErrr);
        return result;
        // .map(res => res.json());
        // .map((res:Response) => res.json());
        // .catch(#<{(| this.handleError |)}>#);
    };
    GameService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Rx_1.Observable["throw"](errMsg);
    };
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
    GameService.prototype.changeState = function (newState) {
        this.state = newState;
    };
    return GameService;
}());
GameService = __decorate([
    core_1.Injectable()
], GameService);
exports.GameService = GameService;
