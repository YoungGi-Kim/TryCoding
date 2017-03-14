"use strict";
var GameState;
(function (GameState) {
    GameState[GameState["ChapterSelect"] = 0] = "ChapterSelect";
    GameState[GameState["LevelSelect"] = 1] = "LevelSelect";
    GameState[GameState["Play"] = 2] = "Play";
    GameState[GameState["Results"] = 3] = "Results";
})(GameState = exports.GameState || (exports.GameState = {}));
