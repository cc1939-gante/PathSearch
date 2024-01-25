import { clamp } from "cc";
import { GameConst } from "./GameConst";

export class Utils {
    public static deepClone(obj: any): any {
        if (typeof obj !== 'object') {
            return obj;
        }
        let newObj = obj instanceof Array ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = typeof obj[key] === 'object' ? this.deepClone(obj[key]) : obj[key];
            }
        }
        return newObj;
    } 

    public static aStarSearch(mapData: number[][], sPos: number[], ePos: number[]): number[] {
        console.time(`AStartSearch find way`);
        let findWays: number[] = [];
        let openList: number[] = [];
        let closeList: Set<number> = new Set();

        openList.push(this.pos2PosNum(sPos));
        let findTarget = false;
        while(openList.length > 0 && !findTarget) {
            openList.sort((a, b) => {
                return this.getMHDDistance(this.posNum2Pos(a), ePos) - this.getMHDDistance(this.posNum2Pos(b), ePos);
            });
            let nextPosNum =  openList.shift();
            let nextPos = this.posNum2Pos(nextPosNum);
            if(nextPosNum == this.pos2PosNum(ePos)) { 
                findTarget = true;
                break;
            }
            findWays.push(nextPosNum);
            closeList.add(nextPosNum);
            let iteratorArr = [-1, 0, 1];
            for(let i = 0; i < iteratorArr.length; i++) {
                for(let j = 0; j < iteratorArr.length; j++) {
                    let x = nextPos[0] + iteratorArr[i];
                    let y = nextPos[1] + iteratorArr[j];
                    if(x < 0 || x > GameConst.MapWidth - 1 || y < 0 || y > GameConst.MapWidth - 1 || mapData[y][x] == 1) { 
                        continue;
                    }
                    let posNum = this.pos2PosNum([x, y]);
                    if(!closeList.has(posNum) && openList.indexOf(posNum) == -1) {
                        openList.push(posNum);
                    }
                } 
            }
        }

        console.timeEnd(`AStartSearch find way`);
        return findWays;
    }

    public static posNum2Pos(pos: number): number[] {
        return [pos % GameConst.MapWidth, Math.floor(pos / GameConst.MapWidth)];
    }

    public static pos2PosNum(pos: number[]): number { 
        return pos[0] + pos[1] * GameConst.MapWidth;
    }

    public static getMHDDistance(pos1: number[], pos2: number[]): number { 
        return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
    }

    public static checkHVForceNeighbor(pos: number[], dir: number[]) { 
        if(Math.abs(dir[0]) == 1) {
            return [[pos[0] + dir[0], pos[1] + 1], [pos[0] + dir[0], pos[1] - 1]];
        }else {
            return [[pos[0] + 1, pos[1] + dir[1]], [pos[0] - 1, pos[1] + dir[1]]];
        }
    }

    public static checkObliqueForceNeighbor(pos: number[], dir: number[]) { 
        return [[pos[0] + dir[0], pos[1] + dir[1]]];
    }

    public static jumpPointSearch(mapData: number[][], sPos: number[], ePos: number[]) {
        let openList: number[] = [];
        let closeSet: Set<number> = new Set();

        openList.push(this.pos2PosNum(sPos));
        let parentPosNum: number;
        let dirs: number[][];
        while(openList.length > 0) {
            let posNum = openList.shift();  
            let curPos = this.posNum2Pos(posNum);
            if(!parentPosNum) {
                dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]; 
            } else {
                let parentPos = this.posNum2Pos(parentPosNum);
                dirs = [[clamp(curPos[0] - parentPos[0], -1, 1), clamp(curPos[1] - parentPos[1], -1, 1)]];
            }

            for(let i = 0; i < dirs.length; i++) {
                let dir = dirs[i];
                



            }
        }   
    } 

}
