import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { EditorRoutingModule } from './editor-routing.module';
import { AssetManagerComponent } from './asset-manager/asset-manager.component';
import { AssetManagerService } from './asset-manager/asset-manager.service';
import { LevelComponent } from './level/level.component';
import { EditorService } from './editor.service';
import { FormsModule } from '@angular/forms';
import { ChaptersComponent } from './chapters/chapters.component';

@NgModule({
    imports: [
		FormsModule,
        CommonModule,
        EditorRoutingModule
    ],
    declarations: [
        EditorComponent,
        AssetManagerComponent,
        LevelComponent,
        ChaptersComponent
    ],
    providers: [
        AssetManagerService,
		EditorService
    ]
})
export class EditorModule { }
