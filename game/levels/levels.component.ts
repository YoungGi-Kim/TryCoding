import { Component, OnInit,Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GameService } from '../game.service';
import { ChapterService } from '../../chapter.service';
import { GameState } from './../game-state.enum'



@Component({
    selector: 'app-level',
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.css']
})





export class LevelsComponent implements OnInit {
    selectedChapter: number;
    
    chapter: {
        _id: Object,
        id: number,
        title: string,
        discription: string,
        lines: [
            {
                destination: { x: number, y: number },
                origin: { x: number, y: number }
            }
        ],
        levels: [
            {
                id: number,
                title: string,
                levelData: {
                    art: Object,
                    gamePlay: Object
                },
                position: {
                    x: number,
                    y: number
                }
            }
        ],
        size: {
            x: number,
            y: number
        }
    };
    container;
    canvas;
    context;
    gridWidth: number;
    gridOffset: number;
    count: number
    setactivemission:boolean = false;
    constructor(
        private gameService: GameService,
        private chapterService: ChapterService,
        private route: ActivatedRoute,
        private router: Router,

    ) {
    }
   

    ngOnInit() {
      
        this.route.params.forEach((params: Params) => {
            this.gameService.state = GameState.LevelSelect;
            this.gameService.chapter = +params['idChapter'];
            this.selectedChapter = this.gameService.chapter;
            // this.chapter = this.gameService.getChapter(this.selectedChapter);
            this.chapterService.getChapter(this.selectedChapter)
            .subscribe(
                res => {
                    console.log(res);
                    this.chapter = res;
                    this.createCanvas();
                  //  this.levelname.length ==res.length;
                    console.log( this.levelname.length);
                },
                error => {
                    console.error(error);
                }
            );
        });
    }

    selectLevel(level: number) {
        this.gameService.level = level;
        this.router.navigate(['/game/' + this.gameService.chapter + '/' + level + '/play']);
    }

   createCanvas() {
        this.container = document.getElementById("levels");
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.container.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.gridWidth = this.canvas.height / this.chapter.size.y;
        this.gridOffset = (this.canvas.width - this.canvas.height) * .5;
        this.addClick();
        this.draw();
        setInterval(() => {
            this.update();
        }, 500);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addClick() {
        this.canvas.addEventListener('click', (event) => {
            let cursor = {
                x: event.pageX - this.canvas.offsetLeft,
                y: event.pageY - this.canvas.offsetTop
            }
            this.chapter.levels.forEach((level) => {
                
                if(this.gridWidth * level.position.x + this.gridOffset -5 <= cursor.x && this.gridWidth * level.position.x + this.gridOffset +5 >= cursor.x)
                    if(this.gridWidth * level.position.y -5 <= cursor.y && this.gridWidth * level.position.y +5 >= cursor.y)
                        // console.log((this.gridWidth * level.x + this.gridOffset) + ' ' + (this.gridWidth * level.y + this.gridOffset) + ' cursor: ' + cursor.x + ' ' +  cursor.y);
                        this.selectLevel(level.id);       
            });
        });
        
    }

    stageclick(){
        this.chapter.levels.forEach((level) => {
           this.selectLevel(1); 
        });
        console.log('스테이지'); 
    }
    clicktoinfo()
    {
       this.setactivemission=true;
        
    }
    
    levelname()
    {
     
  var element = document.getElementById("stageclickfalse");
       element.addEventListener('click', () =>this.setactivemission=false);

   
      var element = document.getElementById("clicktoinfo");
       element.addEventListener('click', () => this.clicktoinfo());
console.log( this.count);

  
        var element = document.getElementById("stageclick");
       element.addEventListener('click', () =>this.stageclick());
//  var element = document.getElementById("changeImage");
//        element.style.backgroundImage="url(assets/img/node_completed.png)";
    }

     update() {
        this.clear();
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.gridWidth = this.canvas.height * .2;
        this.gridWidth = this.canvas.height / this.chapter.size.y;
        this.addClick();
        this.draw();
    }

    draw() {
        this.chapter.lines.forEach((line) => {
            this.drawLine(line.origin, line.destination);
        })
        this.chapter.levels.forEach((level) => {
            this.drawDot(level);
        })
    }

    drawDot(level) {
        let context = this.context;
        context.beginPath();
        context.arc(this.gridWidth * level.position.x + this.gridOffset, this.gridWidth * level.position.y, 10, 0, 2*Math.PI, false);
        context.fillStyle = "#fff",
            context.fill();
    }

    drawLine(origin, destination) {
        let context = this.context;
        context.beginPath();
        context.moveTo(this.gridWidth * origin.x + this.gridOffset, this.gridWidth * origin.y);
        context.lineTo(this.gridWidth * destination.x + this.gridOffset, this.gridWidth * destination.y);
        context.strokeStyle = '#fff';
        context.stroke();
    }

}

