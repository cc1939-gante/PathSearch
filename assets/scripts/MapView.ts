import { _decorator, Component, instantiate, Label, Node, Vec3 } from 'cc';
import { GameConst } from './GameConst';
import { GameData } from './GameData';
import { Utils } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('Mapview')
export class MapView extends Component {

    @property(Node) nodeMap: Node = null;
    @property(Node) tempRoadNode: Node = null;
    @property(Node) tempWallNode: Node = null;
    @property(Node) wayNode: Node = null;
    @property(Node) wayLayer: Node = null;
    @property(Node) nodeStart: Node = null;
    @property(Node) nodeEnd: Node = null;

    private _mapData: number[][] = null;
    private _startPos: number[] = [];
    private _endPos: number[] = [];

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
        this.setEndPos([51, 51]);
    }
    
    update(deltaTime: number) {
        
    }

    drawMap(): void {
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
                    node.setScale(new Vec3(10 / GameConst.MapWidth, 10 / GameConst.MapHeight, 1));
                    node.setPosition(startX + j * GameConst.GridWidth, startY + i * GameConst.GridHeight);
                } else {
                    // 画路
                    node = instantiate(this.tempRoadNode);
                    node.setScale(new Vec3(10 / GameConst.MapWidth, 10 / GameConst.MapHeight, 1));
                    node.setPosition(startX + j * GameConst.GridWidth, startY + i * GameConst.GridHeight);
                }
                node.parent = this.nodeMap;
            }
        }

        console.log("after draw map");
    }

    onBtnFindWay() {
        let way = Utils.aStarSearch(this._mapData, this._startPos, this._endPos);
        console.log(`way: ${way}`);
        // 画出路线
        this.drawWay(way);
    }

    drawWay(way: number[]): void { 
        this.wayLayer.destroyAllChildren();

        for(let i = 0; i < way.length; i++) {
            let pos = Utils.posNum2Pos(way[i]);
            let node = instantiate(this.wayNode);
            node.setScale(new Vec3(10 / GameConst.MapWidth, 10 / GameConst.MapHeight, 1));
            node.setPosition(pos[0] * GameConst.GridWidth, pos[1] * GameConst.GridHeight);
            node.getComponentInChildren(Label).string = i + "";
            node.parent = this.wayLayer;
            node.active = false;
        }

        let showIdx = 0;
        this.schedule(()=>{
            if(showIdx >= this.wayLayer.children.length) { 
                this.unscheduleAllCallbacks();
                return;
            } 

            this.wayLayer.children[showIdx].active = true;
            showIdx++;
        }, 0.001);
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
}
    

