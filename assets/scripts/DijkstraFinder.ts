import { Utils } from "./Utils";

export default class DijkstraFinder {
    static parent: number[] = [];
    static findPath(sx: number, sy: number, ex: number, ey: number, graph: number[][]) {
        console.time(`DijkstraFinder find path`);
        this.parent = [];
        let openList: number[] = [Utils.pos2PosNum([sx, sy])];
        let closeSet: Set<number> = new Set();  

        while(openList.length > 0) {
            let posNum = openList.shift();
            let pos = Utils.posNum2Pos(posNum);
            if(pos[0] == ex && pos[1] == ey) {
                return this.backtrace(posNum);
            }
            closeSet.add(posNum);
            let neighbors = this.getNeighbors(pos[0], pos[1], graph);
            for(let i = 0; i < neighbors.length; i++) {
                let neighborPosNum = neighbors[i];
                if(!closeSet.has(neighborPosNum) && openList.indexOf(neighborPosNum) == -1) {
                    openList.push(neighborPosNum);
                    this.parent[neighborPosNum] = posNum;
                }
            }
        }

        console.error(`can not find path`);
        console.timeEnd(`DijkstraFinder find path`);
        return null;
    }

    static backtrace(posNum: number): number[] {
        let path: number[] = [];
        while(this.parent[posNum]) {
            path.push(this.parent[posNum]);
            posNum = this.parent[posNum];
        }

        console.timeEnd(`DijkstraFinder find path`);
        return path.reverse();
    }

    static getNeighbors(x: number, y: number, graph: number[][]) {
        let dir = [-1, 0 , 1];
        let neighbors: number[]  = [];
        for(let i = 0; i < dir.length; i++) {
            for(let j = 0; j < dir.length; j++) {
                let xx = x + dir[i];
                let yy = y + dir[j];
                if(xx < 0 || xx > graph.length - 1 || yy < 0 || yy > graph[0].length - 1 || graph[yy][xx] == 1) {
                    continue;
                }
                neighbors.push(Utils.pos2PosNum([xx, yy]));
            }
        }
        return neighbors;
    }

}