import { Component, OnInit } from '@angular/core';
import { Environment } from './environment';
import { LevelService } from '../../level.service';
import { EditorService } from './../editor.service';
import { EditorState } from './../editor-state.enum';
import { LayerType } from './layer-type.enum';
import { Level, LevelData, Layer, Tile, Vector2, GameObject, GameObjectType } from '../../../assets/game/level';
import { Router, ActivatedRoute, Params } from '@angular/router';
import ProccessCode from '../../../lib/utils/proccess-code';

@Component({
	selector: 'app-level',
	templateUrl: './level.component.html',
	styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
	selectedLayer: Layer = new Layer('empty', LayerType.tiles);
	gameObjectType = GameObjectType;
    chapterId: number;
	levelId: number;
	assetPath = "/assets/game/assets/";
	gridimg;
	images = [[], []];
	imagesDisplay = [
		[]
	];
	imagesLoading: Array<Array<boolean>> = [[],[]];
	layer;
	context;
	defaultSize = 128;
	defaultRatio;
	mousePos: Vector2 = { x: 0, y: 0};
	layerType = LayerType.tiles;
	informationTab = false;
	mouseHold;
	dimension: Vector2 = { x: 0, y: 0};
	gridOffset: Vector2 = { x: 0, y: 0};
	level: Level;
	gridSize;
	ratio;
	isDown = false;
	gameplayLayer = false;
	propSnapping = false;
	propLayers = true;
	tileLayers = true;
	mouse: {
		state: string,
		worldPosition: Vector2,
		screenPosition: Vector2,
		gridPosition: Vector2,
		subgridPosition: Vector2,
	} = {
		state: "",
		worldPosition: new Vector2(),
		screenPosition: new Vector2(),
		gridPosition: new Vector2(),
		subgridPosition: new Vector2()
	};

	constructor(
		private editorService: EditorService,
		private levelService: LevelService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			this.chapterId = +params['idChapter'];
			this.levelId = +params['idLevel'];
			this.editorService.state = EditorState.level;
			this.gridimg = new Image();
			this.gridimg.src = this.assetPath + 'interface/editorgrid.png';
			this.defaultRatio = this.defaultSize/256;
			this.level = new Level;
			this.level.levelData.art[0] = new Layer('Layer1', LayerType.props);
			this.level.levelData.art[1] = new Layer('Layer2', LayerType.tiles);
			this.level.levelData.art[1].layerType = LayerType.props;
			this.getImageData();
			this.layer = document.getElementById('layer');
			this.context = this.layer.getContext('2d');
			this.gridSize = this.defaultSize;
			this.ratio = this.gridSize/256;
			this.setEventListeners();
			this.setDimensions();
			for(let i = 0; i < 5; i++) {
				this.decrease();
			}
		});
	}

	gameObjectTypeKeys(): Array<string> {
		let keys = Object.keys(this.gameObjectType);
		return keys.splice(keys.length/2, keys.length-1);
	}

	getImageData() {
		let tiles;
		let props;

		this.levelService.getTiles()
		.subscribe(
			res => {
				res.sort((a, b) => {
					let idA = a.id.toUpperCase();
					let idB = b.id.toUpperCase();
					if(idA < idB) return -1;
					if(idA > idB) return 1;
					return 0;
				});
				tiles = res;
				if(props) {
					this.loadMultiImages({ tiles: tiles, props: props });
				}
			},
			err => {
				console.log(err);
			}
		)

		this.levelService.getProps()
		.subscribe(
			res => {
				res.sort((a, b) => {
					let idA = a.id.toUpperCase();
					let idB = b.id.toUpperCase();
					if(idA < idB) return -1;
					if(idA > idB) return 1;
					return 0;
				});
				props = res;
				if(tiles) {
					this.loadMultiImages({ tiles: tiles, props: props });
				}
			},
			err => {
				console.log(err);
			}
		)
	}

	loadMultiImages(sources) {
		let objectKeys = Object.keys(sources);
		for(let j = 0; j < objectKeys.length; j++) {
			for (let i = 0; i < sources[objectKeys[j]].length; i++) {
				this.imagesLoading[j].push(false);
				let obj = sources[objectKeys[j]][i];
				obj.img = new Image();;
				obj.img.src = this.assetPath + sources[objectKeys[j]][i].file;
				obj.img.onload = () => {
					this.imagesLoading[j][i] = true;
					this.loadingDone(sources)
				}
				this.images[j].push(obj);
			}
		}
	}

	loadingDone(sources){
		let objectsNotLoaded = [];
		let objectKeys = Object.keys(sources);
		let allDone: boolean = true;
		for(let i = 0; i < this.imagesLoading.length; i++) {
			for(let j = 0; j < this.imagesLoading[i].length; j++) {
				if(!this.imagesLoading[i][j]) {
					allDone = false;
					objectsNotLoaded.push(sources[objectKeys[i]][j].id);
				}
			}
		}
		if(allDone) {
			this.mouseHold = this.images[0][0];
			setInterval(() => {
				this.update();
			}, 100);
			this.levelService.getLevel(this.chapterId, this.levelId)
			.subscribe(
				res => {
					console.log(res);
					this.level = res;
					for(let i = 0; i < this.level.levelData.art.length; i++)
					this.level.levelData.art[i].active = true;
					this.selectedLayer = this.level.levelData.art[0];

					if(this.level.description == 'undefined')
					this.level.description = "";

					if(this.level.levelData.prefill == 'undefined')
					this.level.levelData.prefill = "";
					else
					this.level.levelData.prefill = ProccessCode.stringToCode(this.level.levelData.prefill);

					if(this.level.levelData.solution == 'undefined')
					this.level.levelData.solution = "";
					else
					this.level.levelData.solution = ProccessCode.stringToCode(this.level.levelData.solution);
				},
				err => {

				}
			)
		}
		else {
			console.log(objectsNotLoaded);
		}
	}

	update(){
		this.refresh(); // Do this before drawing on the canvas
		this.drawGrid();
		this.drawLayer();
		if(this.gameplayLayer){
			this.context.globalAlpha = 0.5;
			this.drawGameplay();
			this.context.globalAlpha = 1;
		}
		this.drawPreview();
	}


	setDimensions() {
		let content = document.getElementById('game');
		let width = content.offsetWidth;
		let height = content.offsetHeight;
		this.dimension = { x: width, y: height };
		this.layer.width = this.dimension.x;
		this.layer.height = this.dimension.y;
	}

	selectItem(id) {
		if(this.layerType == LayerType.props){
			for (let i = 0; i < this.images[LayerType.props].length; i++) {
				if(id == this.images[LayerType.props][i].id){
					this.mouseHold = this.images[LayerType.props][i];
				}
			}
		}
		else if(this.layerType == LayerType.tiles){
			if(id) {
				this.mouseHold = null;
			}
			for (let i = 0; i < this.images[LayerType.tiles].length; i++) {
				if(id == this.images[LayerType.tiles][i].id) {
					this.mouseHold = this.images[LayerType.tiles][i];
				}
			}
		}
		else {
			this.mouseHold = {
				position: { x: 0, y: 0},
				collider: { x: 256, y: 256},
				colliderOffset: { x: 0, y: 0},
				dimensions: { x: 256, y: 256},
				pivot: { x: 0, y: 0},
				size: { x: 1, y: 1},
				objectType: id
			}
		}
	}

	refresh(){
		this.context.clearRect(0,0,this.dimension.x, this.dimension.y);
	}

	drawGrid() {
		for (let x = 0; x < 50; x++) {
			for (let y = 0; y < 50; y++) {
				this.context.drawImage(this.gridimg, x*this.gridSize+this.gridOffset.x, y*this.gridSize+this.gridOffset.y, this.gridSize, this.gridSize)
				this.context.stroke();
			}
		}
	}

	drawLayer() {
		for (let j = 0; j < this.level.levelData.art.length; j++) {
			if(!this.level.levelData.art[j].active)
			continue;
			let layerType: LayerType = this.level.levelData.art[j].layerType == 0 ? LayerType.tiles : LayerType.props;
			for (let i = 0; i < this.level.levelData.art[j].tiles.length; i++) {
				let img = null;
				let id = this.level.levelData.art[j].tiles[i].tile;
				let position = this.level.levelData.art[j].tiles[i].position;
				let innerPosition = this.level.levelData.art[j].tiles[i].innerPosition == null ? { x: 0, y: 0 } : this.level.levelData.art[j].tiles[i].innerPosition;

				for(let k = 0; k < this.images[layerType].length; k++ ) {
					if(id == this.images[layerType][k].id) {
						img = this.images[layerType][k];
					}
					else if(k == this.images[layerType].length) {
						console.log("tile not found");
					}
				}

				position = this.drawLocation(position, innerPosition, img);
				let dimension = {
					x: this.timesRatio(img.dimensions.x),
					y: this.timesRatio(img.dimensions.y)
				};
				this.context.drawImage(img.img, position.x, position.y, dimension.x, dimension.y);
			}
		}
	}

	drawLocation(location, innerPosition, tile) {
		let position: Vector2 = { x: 0, y: 0 };
		position.x = ((location.x * this.gridSize) + (innerPosition.x * this.gridSize)) - this.timesRatio(tile.pivot.x) + this.gridOffset.x;
		position.y = ((location.y * this.gridSize) + (innerPosition.y * this.gridSize)) - this.timesRatio(tile.pivot.y) + this.gridOffset.y;
		return position;
	}

	drawGameplay() {
		for (let j = 0; j < this.level.levelData.art.length; j++) {
			for (let i = 0; i < this.level.levelData.art[j].tiles.length; i++) {
				let img;
				let id = this.level.levelData.art[j].tiles[i].tile;
				let pivotOffset = {x:0, y:0};

				for(let i = 0; i < this.images[j].length; i++ ) {
					if(id == this.images[j][i].id) {
						img = this.images[j][i];
						if(this.level.levelData.art[j].layerType == LayerType.props)
						pivotOffset = img.pivot;
					}
				}
				let position = {
					x: ((this.level.levelData.art[j].tiles[i].position.x * this.gridSize) + (this.level.levelData.art[j].tiles[i].innerPosition.x * this.gridSize)) - (this.timesRatio(img.pivot.x - pivotOffset.x) - this.timesRatio(img.colliderOffset.x)) + this.gridOffset.x,
					y: ((this.level.levelData.art[j].tiles[i].position.y * this.gridSize) + (this.level.levelData.art[j].tiles[i].innerPosition.y * this.gridSize)) - (this.timesRatio(img.pivot.y - pivotOffset.y) - this.timesRatio(img.colliderOffset.y)) + this.gridOffset.y
				}
				let collider = { x: this.timesRatio(img.collider.x), y: this.timesRatio(img.collider.y) };
				this.context.fillStyle = "rgb(255,0,0)";
				this.context.fillRect( position.x, position.y, collider.x, collider.y);
			}
		}

		for (let i = 0; i < this.level.levelData.gameplay[0].objects.length; i++) {
			// let img;
			let object = this.level.levelData.gameplay[0].objects[i];

			let position = {
				x: object.position.x * this.gridSize + this.timesRatio(object.pivot.x) + this.timesRatio(object.colliderOffset.x) + this.gridOffset.x,
				y: object.position.y * this.gridSize + this.timesRatio(object.pivot.y) + this.timesRatio(object.colliderOffset.y) + this.gridOffset.y
			}
			let collider = { x: this.timesRatio(object.collider.x), y: this.timesRatio(object.collider.y) };
			this.context.fillStyle = this.getColor(object.objectType);
			this.context.fillRect( position.x, position.y, collider.x, collider.y);
		}
	}

	getColor(gameObjectType) {
		if(gameObjectType == GameObjectType.collider)
		return "rgb(255,128,128)";
		else if(gameObjectType == GameObjectType.checkpoint)
		return "rgb(255,255,128)";
		else if(gameObjectType == GameObjectType.objective)
		return "rgb(128,255,255)";
		else if(gameObjectType == GameObjectType.hackobject)
		return "rgb(154,112,33)"; 
		else if(gameObjectType == GameObjectType.resobject)
		return "rgb(255,112,5)";
		else if(gameObjectType == GameObjectType.finish)
		return "rgb(128,255,128)";
		else if(gameObjectType == GameObjectType.start)
		return "rgb(128,128,255)";
		else if(gameObjectType == GameObjectType.enemystart)
		return "rgb(5, 221, 123)";
		else if(gameObjectType == GameObjectType.enemypath)
		return "rgb(40, 255, 200)"
		else if(gameObjectType == GameObjectType.enemyfinish)
		return "rgb(100, 240, 84)"
	}

	drawPreview() {
		let screenGridPosition = {
			x: (Math.floor((this.mouse.screenPosition.x - this.gridOffset.x % this.gridSize)/this.gridSize)),
			y: (Math.floor((this.mouse.screenPosition.y - this.gridOffset.y % this.gridSize)/this.gridSize))
		};

		this.context.globalAlpha = 0.5;
		if(this.mouseHold != null && this.layerType != LayerType.gameplay){
			if(this.layerType == LayerType.tiles){
				let img = this.mouseHold.img;
				let position = {
					x: screenGridPosition.x * this.gridSize + this.gridOffset.x % this.gridSize - this.timesRatio(this.mouseHold.pivot.x),
					y: screenGridPosition.y * this.gridSize + this.gridOffset.y % this.gridSize - this.timesRatio(this.mouseHold.pivot.y)
				}
				let dimensions = {
					x: this.timesRatio(this.mouseHold.dimensions.x),
					y: this.timesRatio(this.mouseHold.dimensions.y)
				}
				this.context.drawImage( img, position.x, position.y, dimensions.x, dimensions.y);
			}else{
				let img = this.mouseHold.img;
				let position: Vector2;
				let screenGridSnappingPosition = {
					x: (Math.floor((this.mouse.screenPosition.x - this.gridOffset.x % (this.gridSize * .25))/(this.gridSize * .25))),
					y: (Math.floor((this.mouse.screenPosition.y - this.gridOffset.y % (this.gridSize * .25))/(this.gridSize * .25)))
				};

				if(this.propSnapping) {
					position = {
						x: screenGridSnappingPosition.x * (this.gridSize * .25) + this.gridOffset.x % (this.gridSize * .25) - this.timesRatio(this.mouseHold.pivot.x),
						y: screenGridSnappingPosition.y * (this.gridSize * .25) + this.gridOffset.y % (this.gridSize * .25) - this.timesRatio(this.mouseHold.pivot.y)
					}
				}
				else {
					position = {
						x: this.mouse.screenPosition.x - this.timesRatio(this.mouseHold.pivot.x),
						y: this.mouse.screenPosition.y - this.timesRatio(this.mouseHold.pivot.y)
					}
				}

				let dimensions = {
					x: this.timesRatio(this.mouseHold.dimensions.x),
					y: this.timesRatio(this.mouseHold.dimensions.y)
				}
				this.context.drawImage(img, position.x, position.y, dimensions.x, dimensions.y);
			}
		}
		this.context.globalAlpha = 1;
	}

	timesRatio(value) {
		return this.ratio * value;
	}

	addObject(e) {
		let x = this.mouse.worldPosition.x;
		let y = this.mouse.worldPosition.y;

		if(this.layerType == LayerType.tiles){
			this.addTile(x, y);
		}
		else if(this.layerType == LayerType.props) {
			this.addProp(x, y);
		}
		else {
			this.addGameObject(x, y);
		}
	}

	addTile(x: number, y: number) {
		if(this.selectedLayer.layerType != LayerType.tiles)
		console.error("Layer type is incorect");
		let tile = {
			tile: null,
			position: { x: 0, y: 0 }
		}
		if(this.mouseHold != null){
			let object = {
				tile: this.mouseHold.id,
				position: {
					x: this.mouse.gridPosition.x,
					y: this.mouse.gridPosition.y
				},
				innerPosition: { x: 0, y: 0 }
			}
			if(this.level.levelData.art.length == 0){
				this.selectedLayer.tiles.push(object);
				return;
			}

			if(!this.checkLayer(this.mouse.gridPosition.x, this.mouse.gridPosition.y, this.mouseHold.id)) {
				console.log(!this.checkLayer(this.mouse.gridPosition.x, this.mouse.gridPosition.y, this.mouseHold.id));
				this.selectedLayer.tiles.push(object);
			}
			else {
				console.log('replace');
			}
		}
		else {
			// eraser
			if(this.getObjectIndex()) {
				this.level.levelData.art[0].tiles.splice(this.getObjectIndex() -1, 1);
			}
		}
	}

	addProp(x: number, y: number) {
		if(this.selectedLayer.layerType != LayerType.props)
		console.error("Layer type is incorect");
		if(this.mouseHold != null) {
			let subGridPosition: Vector2;
			if(this.propSnapping) {
				let miniGrid = this.gridSize * .25;

				subGridPosition = {
					x: Math.floor((this.mouse.worldPosition.x - this.mouse.gridPosition.x * this.gridSize / this.gridSize) / .25) * .25,
					y: Math.floor((this.mouse.worldPosition.y - this.mouse.gridPosition.y * this.gridSize / this.gridSize) / .25) * .25
				}
			}
			else {
				subGridPosition = this.mouse.subgridPosition
			}

			let object = {
				tile: this.mouseHold.id,
				position: this.mouse.gridPosition,
				innerPosition: subGridPosition
			}
			this.selectedLayer.tiles.push(object);
		}
		else {
			// eraser

			for(let i = this.selectedLayer.tiles.length -1; i >= 0; i--) {
				if(this.containsPosition(this.mouse.worldPosition, this.selectedLayer.tiles[i])) {
					this.selectedLayer.tiles.splice(i, 1);
					break;
				}
			}
		}
	}

	containsPosition(position: Vector2, object): boolean {
		let img;
		for(let k = 0; k < this.images[LayerType.props].length; k++ ) {
			if(object.tile == this.images[LayerType.props][k].id) {
				img = this.images[LayerType.props][k];
			}
		}

		let xMin = ((object.position.x * this.gridSize) + (object.innerPosition.x * this.gridSize)) - this.timesRatio(img.pivot.x);
		let xMax = ((object.position.x * this.gridSize) + (object.innerPosition.x * this.gridSize)) - this.timesRatio(img.pivot.x) + this.timesRatio(img.dimensions.x);
		let yMin = ((object.position.y * this.gridSize) + (object.innerPosition.y * this.gridSize)) - this.timesRatio(img.pivot.y);
		let yMax = ((object.position.y * this.gridSize) + (object.innerPosition.y * this.gridSize)) - this.timesRatio(img.pivot.y) + this.timesRatio(img.dimensions.y);

		if(position.x > xMin && position.x < xMax && position.y > yMin && position.y < yMax) {
			return true;
		}
		return false;
	}


	addGameObject(x: number, y: number) {
		let tile = {
			tile: null,
			position: { x: 0, y: 0 }
		}
		if(this.mouseHold != null){

			let object = {
				position: { x: this.mouse.gridPosition.x, y: this.mouse.gridPosition.y},
				collider: { x: 256, y: 256},
				colliderOffset: { x: 0, y: 0},
				dimensions: { x: 256, y: 256},
				pivot: { x: 0, y: 0},
				size: { x: 1, y: 1},
				objectType: this.mouseHold.objectType
			}
			console.log(this.mouseHold.objectType);

			if(!this.checkLayer(this.mouse.gridPosition.x, this.mouse.gridPosition.y, object)) {
				this.level.levelData.gameplay[0].objects.push(object);
			}
			else {
				console.log('replace');
			}
		}
		else {
			// eraser
			if(this.getObjectIndex()) {
				this.level.levelData.gameplay[0].objects.splice(this.getObjectIndex() -1, 1);
			}
		}
	}

	getObjectIndex() {
		if(this.layerType == LayerType.tiles) {
			for (let i = 0; i < this.level.levelData.art[0].tiles.length; i++) {
				if(this.level.levelData.art[0].tiles[i].position.x == this.mouse.gridPosition.x && this.level.levelData.art[0].tiles[i].position.y == this.mouse.gridPosition.y) {
					return i + 1; }
				}
			}
			else if(this.layerType == LayerType.gameplay) {
				for (let i = 0; i < this.level.levelData.gameplay[0].objects.length; i++) {
					if(this.level.levelData.gameplay[0].objects[i].position.x == this.mouse.gridPosition.x && this.level.levelData.gameplay[0].objects[i].position.y == this.mouse.gridPosition.y) {
						return i + 1; }
					}
				}
				else {
					// for (let i = 0; i < this.propobj.length; i++) {
					//     if(this.propobj[i][0] == this.realPos.x && this.propobj[i][1] == this.realPos.y)
					//     return i;
					// }
				}
			}

			checkLayer(ox, oy, obj) {
				let position: { x: number, y: number };
				if(this.layerType == LayerType.tiles) {
					for (let i = 0; i < this.selectedLayer.tiles.length; i++) {
						position = { x: this.selectedLayer.tiles[i].position.x, y: this.selectedLayer.tiles[i].position.y };

						if(position.x == ox && position.y == oy) {
							this.selectedLayer.tiles[i].tile = obj;
							return true;
						}
					}
				}
				else if(this.layerType == LayerType.gameplay) {
					for (let i = 0; i < this.level.levelData.gameplay[0].objects.length; i++) {
						position = {
							x: this.level.levelData.gameplay[0].objects[i].position.x,
							y: this.level.levelData.gameplay[0].objects[i].position.y
						};

						if(position.x == ox && position.y == oy) {

							this.level.levelData.gameplay[0].objects.splice(i, 1, obj);
							return true;
						}
					}
				}
				else {
					// for (let i = 0; i < this.propobj.length; i++) {
					//     position = { x: this.propobj[i][0], y: this.propobj[i][1] };
					//
					//     if(position.x == ox && position.y == oy) {
					//         this.propobj[i][2] = obj;
					//         return true;
					//     }
					// }

				}
				return false;
			}

			undoLast() {
				this.selectedLayer.tiles.splice(this.selectedLayer.tiles.length-1, 1);
			}

			setEraser() {
				this.mouseHold = null;
			}

			setGameplay() {
				this.gameplayLayer = !this.gameplayLayer;
			}

			setLayerType(newLayerType) {
				this.informationTab = false;
				if(newLayerType == LayerType.tiles) {
					this.layerType = LayerType.tiles;
					this.mouseHold = this.images[LayerType.tiles][0];
				}
				else if(newLayerType == LayerType.props) {
					this.layerType = LayerType.props;
					this.mouseHold = this.images[LayerType.props][0];
				}
				else if(newLayerType == LayerType.gameplay) {
					this.layerType = LayerType.gameplay;
					this.mouseHold = {
						position: { x: 0, y: 0},
						collider: { x: 256, y: 256},
						colliderOffset: { x: 0, y: 0},
						dimensions: { x: 256, y: 256},
						pivot: { x: 0, y: 0},
						size: { x: 1, y: 1},
						objectType: 0
					}
				}
			}

			setMouse(e) {

				let offset = this.gridOffset;
				let gridSize = this.gridSize;
				this.mouse.screenPosition = { x: e.layerX , y: e.layerY};
				this.mouse.worldPosition = {
					x: this.mouse.screenPosition.x - offset.x,
					y: this.mouse.screenPosition.y - offset.y
				}
				this.mouse.gridPosition = {
					x: Math.floor(this.mouse.worldPosition.x / gridSize),
					y: Math.floor(this.mouse.worldPosition.y / gridSize)
				}
				this.mouse.subgridPosition = {
					x:(this.mouse.worldPosition.x-(this.mouse.gridPosition.x*this.gridSize))/this.gridSize,
					y:(this.mouse.worldPosition.y-(this.mouse.gridPosition.y*this.gridSize))/this.gridSize
				};
			}

			checkIfAlreadyAdded(id) {
				for(let j = 0; j < this.level.levelData.tiles.length; j++) {
					if(this.level.levelData.tiles[j].id == id) {
						return true;
					}
				}
				return false;
			}

			increase(){
				this.gridSize = this.gridSize * 1.1;
				this.ratio = this.gridSize/256;
			}

			decrease(){
				this.gridSize = this.gridSize * 0.9;
				this.ratio = this.gridSize/256;
			}

			back() {
				if(confirm("Are you sure you saved your work and want to leave this page?")) this.router.navigate(['/editor/chapter/' + this.chapterId]);
			}

			save() {
				console.log(this.images);
				let add: boolean = true;
				let start: boolean = false ;
				let multibleStart: boolean = false;
				let finish: boolean = false;
				let multibleFinish: boolean = false;
				this.level.levelData.tiles = new Array<Tile>();
				let levelSize = new Vector2();
				let tiles = [];
				let props = [];

				for(let i = 0; i < this.level.levelData.art.length; i++) {
					for(let j = 0; j < this.level.levelData.art[i].tiles.length; j++) {
						let object = this.level.levelData.art[i].tiles[j];
						let layerType = this.level.levelData.art[i].layerType == 0 ? LayerType.tiles : LayerType.props;
						let id = object.tile;
						levelSize.x = levelSize.x < object.position.x ? object.position.x : levelSize.x;
						levelSize.y = levelSize.y < object.position.y ? object.position.y : levelSize.y;
						if(!this.checkIfAlreadyAdded(id)) {
							let img;

							for(let l = 0; l < this.images[layerType].length; l++ ) {
								if(id == this.images[layerType][l].id) {
									img = this.images[layerType][l];
								}
							}
							// delete img.img;
							if(layerType == LayerType.tiles)
							tiles.push(img._id);
							else
							props.push(img._id);
						}
					}
				}
				this.level.levelData.tiles = tiles;
				this.level.levelData.props = props;

				for(let i = 0; i < this.level.levelData.gameplay.length; i++) {
					for(let j = 0; j < this.level.levelData.gameplay[i].objects.length; j++) {
						let object = this.level.levelData.gameplay[i].objects[j];
						levelSize.x = levelSize.x < object.position.x ? object.position.x : levelSize.x;
						levelSize.y = levelSize.y < object.position.y ? object.position.y : levelSize.y;
						if(this.level.levelData.gameplay[i].objects[j].objectType == GameObjectType.start){
							if(start) {
								multibleStart = true;
							}
							else
							start = true;
						}

						else if(this.level.levelData.gameplay[i].objects[j].objectType == GameObjectType.finish) {
							if(finish) {
								multibleFinish = true;
							}
							else
							finish = true;
						}
					}
				}
				this.level.levelData.size = levelSize;
				if(!start) {
					alert('Level needs a start');
					return;
				}
				else if(multibleStart) {
					alert('Level can only have one start');
					return;
				}
				else if(multibleFinish) {
					alert('Level can only have one finish');
					return;
				}

				this.level.levelData.prefill = ProccessCode.codeToString(this.level.levelData.prefill);
				this.level.levelData.solution = ProccessCode.codeToString(this.level.levelData.solution);

				console.log(this.level);
				this.levelService.saveLevel(this.level._id, this.level)
				.subscribe(
					res => {
						console.log(res);

					},
					err => {
						console.log(err);
					}
				);
				this.level.levelData.prefill = ProccessCode.stringToCode(this.level.levelData.prefill);
				this.level.levelData.solution = ProccessCode.stringToCode(this.level.levelData.solution);
			}

			selectLayer(layer) {
				this.selectedLayer = layer;
				console.log(layer.layerType);
				this.setLayerType(layer.layerType);
			}

			addLayer(layerType) {
				console.log(layerType);
				this.level.levelData.art.push(new Layer(LayerType[layerType], layerType));
			}

			deleteLayer(index) {
				if(confirm("Are you sure you want to remove this layer?"))
				this.level.levelData.art.splice(index, 1);
			}

			renameLayer(layer) {
				let newName = prompt("New layer name: ", LayerType[layer.layerType]);
				if(newName) {
					layer.name = newName;
				}
			}

			setEventListeners() {
				this.layer.addEventListener('mousemove', (e)=>{
					this.setMouse(e);
				});

				this.layer.onmousedown = (e) => {
					this.setMouse(e);
					if(e.which == 1){
						this.isDown = true;
						this.addObject(e);
					}
				};

				this.layer.onmousemove = (e) => {
					this.setMouse(e);
					if(this.isDown && this.layerType != LayerType.props)
					this.addObject(e);
				}

				this.layer.onmouseup = (e) => {
					this.setMouse(e);
					if(e.which == 1){
						this.isDown = false;
					}
				};

				window.onkeydown = (e) => {
					let panningSpeed = 25;
					if(e.keyCode == 83) {
						this.gridOffset.y = this.gridOffset.y - panningSpeed;
					}
					if(e.keyCode == 87) {
						this.gridOffset.y = this.gridOffset.y + panningSpeed;
					}
					if(e.keyCode == 68) {
						this.gridOffset.x = this.gridOffset.x - panningSpeed;
					}
					if(e.keyCode == 65) {
						this.gridOffset.x = this.gridOffset.x + panningSpeed;
					}
					if(e.keyCode == 16) {
						this.propSnapping = true;
					}
				};

				window.onkeyup = (e) => {
					if(e.keyCode == 16){
						this.propSnapping = false;
					}
				};

				window.onresize = () => {
					this.setDimensions();
				};

				window.onload = () => {
					this.setDimensions();
				}
			}
		}
		
