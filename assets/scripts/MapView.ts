import { _decorator, Color, Component, Enum, instantiate, Label, Node, Sprite, Toggle, ToggleContainer, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';
import DijkstraFinder from './DijkstraFinder';
import { GameConst } from './GameConst';
import { GameData } from './GameData';
import { Utils } from './Utils';
const { executeInEditMode, ccclass, property } = _decorator;

enum EAlgorithmType {
    AStar = 0,
    Dijkstra = 1,
}

@ccclass('Mapview')
export class MapView extends Component {

    @property(Node) nodeMap: Node = null;
    @property(Node) tempRoadNode: Node = null;
    @property(Node) tempWallNode: Node = null;
    @property(Node) wayNode: Node = null;
    @property(Node) wayLayer: Node = null;
    @property(Node) nodeStart: Node = null;
    @property(Node) nodeEnd: Node = null;
    @property(ToggleContainer) tabs: ToggleContainer = null;
    @property() 
    private _tabIdx: EAlgorithmType = EAlgorithmType.AStar;
    @property({type: Enum(EAlgorithmType)}) 
    get tabIdx() { return this._tabIdx; }
    set tabIdx(type: EAlgorithmType) {
        this._tabIdx = type;
        this.tabs.toggleItems.forEach((toggle, idx) => { 
            toggle.isChecked = idx == this._tabIdx;
        });
    }

    private _mapData: number[][] = null;
    private _startPos: number[] = [];
    private _endPos: number[] = [];

    private isDrawing: boolean;

    protected onLoad(): void {
        console.log(`map view onLoad`);

        this.initData();
    }

    private initData(): void {   
        this._mapData = Utils.deepClone(GameData.getInstance<GameData>().MAP_DATA3);
    }

    start() {
        console.log(`map view start`);
        this.drawMap();
        this.setStartPos([1, 1]);
        this.setEndPos([GameConst.MapWidth - 2, GameConst.MapHeight - 2]);
    }
    
    update(deltaTime: number) {
        
    }

    drawMap(): void {
        this.nodeMap.destroyAllChildren();
        let mapWidth = GameConst.MapWidth;
        let mapHeight = GameConst.MapHeight;
        let startX = 0;
        let startY = 0;

        for (let i = 0; i < mapHeight; i++) {
            for (let j = 0; j < mapWidth; j++) {
                let node: Node;
                if (this._mapData[i][j] == 1) {
                    // 画墙
                    node = instantiate(this.tempWallNode);
                    node.setScale(new Vec3(GameConst.GridWidth / 60, GameConst.GridHeight / 60, 1));
                    node.setPosition(startX + j * GameConst.GridWidth, startY + i * GameConst.GridHeight);
                } else {
                    // 画路
                    node = instantiate(this.tempRoadNode);
                    node.setScale(new Vec3(GameConst.GridWidth / 60, GameConst.GridHeight / 60, 1));
                    node.setPosition(startX + j * GameConst.GridWidth, startY + i * GameConst.GridHeight);
                }
                node.parent = this.nodeMap;
            }
        }

        console.log("after draw map");
    }

    onBtnFindWay() {
        let way: number[];
        switch(this._tabIdx) {
            case EAlgorithmType.AStar: 
                way = Utils.aStarSearch(this._mapData, this._startPos, this._endPos);
                break;
            case EAlgorithmType.Dijkstra:
                way = DijkstraFinder.findPath(this._startPos[0], this._startPos[1], this._endPos[0], this._endPos[1], this._mapData);
                break;
        }
        // 画出路线
        this.drawWay(way);
    }

    drawWay(way: number[]): void { 
        if(this.isDrawing) return;
        this.isDrawing = true;
        for(let i = 0; i < way.length; i++) {
            let pos = Utils.posNum2Pos(way[i]);
            let node = instantiate(this.wayNode);
            node.getComponent(Sprite).color = this.getWayColorByType(this._tabIdx);
            node.setScale(new Vec3(10 / GameConst.MapWidth, 10 / GameConst.MapHeight, 1));
            node.setPosition(pos[0] * GameConst.GridWidth, pos[1] * GameConst.GridHeight);
            node.getComponentInChildren(Label).string = i + "";
            node.parent = this.wayLayer;
            node.active = false;
        }

        let showIdx = 0;
        this.schedule(()=>{
            if(showIdx >= this.wayLayer.children.length) { 
                this.isDrawing = false;
                this.unscheduleAllCallbacks();
                return;
            } 

            this.wayLayer.children[showIdx].active = true;
            showIdx++;
        }, 0.001);
    }

    onBtnClearWay() {
        this.wayLayer.destroyAllChildren();
    }

    setStartPos(pos: number[]) {
        this._startPos = pos;
        this.nodeStart.setPosition(this._startPos[0] * GameConst.GridWidth, this._startPos[1] * GameConst.GridHeight);
        this._mapData[pos[1]][pos[0]] = 0;
        this.nodeStart.setScale(new Vec3(10 / GameConst.MapWidth, 10 / GameConst.MapHeight, 1));
    }

    setEndPos(pos: number[]) { 
        this._endPos = pos;
        this.nodeEnd.setPosition(this._endPos[0] * GameConst.GridWidth, this._endPos[1] * GameConst.GridHeight);
        this._mapData[pos[1]][pos[0]] = 0;
        this.nodeEnd.setScale(new Vec3(10 / GameConst.MapWidth, 10 / GameConst.MapHeight, 1));
    }

    onToggleChange(toggle: Toggle) { 
        if(EDITOR) {
            return;
        }
        this._tabIdx = this.tabs.toggleItems.indexOf(toggle);
    }

    private getWayColorByType(algorithmType: number) {
        switch(algorithmType) {
            case EAlgorithmType.AStar: return new Color().fromHEX("#179B41");
            case EAlgorithmType.Dijkstra: return new Color().fromHEX("#838D0A");
        }
    }
}
    

