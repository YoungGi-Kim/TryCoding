import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { EditorComponent }    from './editor.component';
import { AssetManagerComponent }    from './asset-manager/asset-manager.component';
import { LevelComponent }    from './level/level.component';
import { ChaptersComponent }    from './chapters/chapters.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'editor',
                component: EditorComponent,
                children: [
                    { path: 'asset-manager', component: AssetManagerComponent },
                    { path: 'chapter/:idChapter/level/:idLevel', component: LevelComponent },
                    { path: 'chapters', component: ChaptersComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class EditorRoutingModule {}
