import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { GameRoutingModule } from './game-routing.module';
import { PlayComponent }    from './play/play.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { LevelsComponent } from './levels/levels.component';
import { ResultsComponent } from './results/results.component';
import { GameService } from './game.service';
import { MouseWheelDirective } from './../mouse-wheel.directive';
import { LevelService } from '../level.service';
import { ChapterService } from '../chapter.service';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { InventoryComponent } from './inventory/inventory.component';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
  ],
  declarations: [
      GameComponent,
      PlayComponent,
      ChaptersComponent,
      LevelsComponent,
      ResultsComponent,
      MouseWheelDirective,
      LeaderboardComponent,
      InventoryComponent,
  ],
  providers: [
      GameService,
	  LevelService,
	  ChapterService
  ]
})



export class GameModule { }
