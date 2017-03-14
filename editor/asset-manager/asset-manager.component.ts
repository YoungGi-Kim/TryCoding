import { Component, OnInit } from '@angular/core';
import { AssetManagerService } from './asset-manager.service';
import { Tile } from '../../../assets/game/level';

@Component({
    selector: 'app-asset-manager',
    templateUrl: './asset-manager.component.html',
    styleUrls: ['./asset-manager.component.css']
})
export class AssetManagerComponent implements OnInit {
    assetCount: { name: string, count: number }[] = [];
    input: {
        props: Tile,
		tiles: Tile,
	}
    preview: string;

    constructor(
        private assetManagerService: AssetManagerService
    ) { }

    ngOnInit() {
    }

    openFile(event) {
        let input = event.target;
        let result = [];
        for (var index = 0; index < input.files.length; index++) {
            let reader = new FileReader();
            reader.onload = () => {
                var text = reader.result;
                result.push(JSON.parse(text));
                this.input = result[0];
                this.preview = JSON.stringify(result[0]);
                this.countAssets();
            }
            reader.readAsText(input.files[index]);
        };
    }

    updateAssets() {
        console.log('test');
        this.assetManagerService.updateAssets(this.input)
        .subscribe(
            res => {
                console.log(res);
            },
            error => {
                console.error(error.text());
            }
        );
    }

    inputEmpty(): boolean {
        if(this.input)
            return true;
        else
            return false;
    }

    countAssets() {
        let assets = this.input;
        let result: { name: string, count: number }[] = [];
        let keys = Object.keys(this.input);
        console.log(assets);
        for(let i = 0; i < keys.length; i++) {
            result[i] = {
                name: keys[i],
                count: 0
            }
            for(let j = 0; j < assets[keys[i]].length; j++)
            result[i].count = j;
        }
        this.assetCount = result;
    }
}
