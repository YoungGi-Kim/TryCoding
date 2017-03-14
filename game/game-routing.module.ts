import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { GameComponent }    from './game.component';
import { PlayComponent }    from './play/play.component';
import { ChaptersComponent }    from './chapters/chapters.component';
import { LevelsComponent }    from './levels/levels.component';
import { ResultsComponent }    from './results/results.component';
import { LeaderboardComponent }    from './leaderboard/leaderboard.component';
import { InventoryComponent }    from './inventory/inventory.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'game',
      component: GameComponent,
      children: [
          { path: 'chapters', component: ChaptersComponent },
          { path: ':idChapter/levels', component: LevelsComponent },
          { path: ':idChapter/:idLevel/play', component: PlayComponent },
          { path: 'results', component: ResultsComponent },
          { path: 'leaderboard', component: LeaderboardComponent },
          { path: 'inventory', component: InventoryComponent }
      ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class GameRoutingModule {}
