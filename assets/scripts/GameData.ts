import { GameConst } from "./GameConst";
import { Singleton } from "./TypeDef";

export class GameData extends Singleton<GameData> {

    public static readonly MAP_WIDTH = 55;
    public static readonly MAP_HEIGHT = 55;
    public readonly MAP_DATA = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 1
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 2
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 3
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 4
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 5
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 6
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 7
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 8
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // 10
    ];

    // 新增一个地图数据，需要中间有遮挡物
    public readonly MAP_DATA2 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 1
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 2
        [1, 0, 0, 1, 1, 1, 1, 0, 0, 1], // 3
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // 4
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // 5
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // 6
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // 7
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // 8
        [1, 0, 0, 1, 1, 1, 1, 0, 0, 1], // 9
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // 10
    ];

    // 生成一个100 * 100 的地图数据，随机生成障碍物
    public readonly MAP_DATA3 = (() => {
        let mapData: number[][] = [];
        for (let i = 0; i < GameConst.MapHeight; i++) {
            mapData[i] = [];
            for (let j = 0; j < GameConst.MapWidth; j++) {
                mapData[i][j] = Math.random() > 0.7 ? 1 : 0;
            }
        }
        return mapData;
    })();
}