// ロボットのタイプ（プレイヤー、敵、スクラップ）
export enum RobotType {
    Player,
    Enemy,
    Scrap
}

// ロボットが動く方向
export enum RobotMove {
    Teleport,
    Wait,
    Left,
    Right,
    Down,
    Up,
    LowerLeft,
    LowerRight,
    UpperLeft,
    UpperRight,
    Unknown
}

// 1体のロボットに関する情報 (座標とロボとのタイプ)
export type RobotInfo = {
    x: number,
    y: number,
    type: RobotType
}

// ロボットの操作に必要な関数をinterfaceで予め定義
export interface RobotRules {
    makeRobots(width: number, height: number, level: number): void;
    canPutRobot(x: number, y: number): boolean;
    canMove(x: number, y: number, width: number, height: number): boolean;
    movePlayer(toward: RobotMove, width: number, height: number): boolean;
    moveEnemey(): boolean;
    wipeOut(): boolean;
    countDeadEnemy(): number;
    countTotalDeadEnemy(level: number): number;
}

// ロボットの管理
export class Robot implements RobotRules {
    robotList: RobotInfo[];

    constructor() {
        this.robotList = [];
    }

    // ロボットの初期配置（プレイヤー、敵同時に行う）
    makeRobots(width: number, height: number, level: number): void {
        this.robotList = [];

        // 0番目は Player
        let x = Math.floor((Math.random() * width) + 1);
        let y = Math.floor((Math.random() * height) + 1);
        this.robotList.push({ x, y, type: RobotType.Player });

        // 1番目から (numOfRobots-1)番目はEnemy
        let count = 0;
        const numOfEnemy = level * 10;
        while (count < numOfEnemy) {
            x = Math.floor((Math.random() * width) + 1);
            y = Math.floor((Math.random() * height) + 1);
            if (!this.canPutRobot(x, y)) {
                // 同じ場所にロボットを置かない
                continue;
            }
            this.robotList.push({ x, y, type: RobotType.Enemy });
            count++;
        }
    }

    // ロボットの配置ができるかチェック
    canPutRobot(x: number, y: number): boolean {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.robotList.length; i++) {
            if (x === this.robotList[i].x && y === this.robotList[i].y) {
                return false;
            }
        }

        return true;
    }

    // プレイヤーロボットが正しく動けるかチェック
    canMove(x: number, y: number, width: number, height: number): boolean {
        // フィールド外に出ないかチェック
        if (x === 0 || y === 0 || x === width + 1 || y === height + 1)
            return false;

        // 移動先にスクラップがあるかチェック
        for (let i = 1; i < this.robotList.length; i++) {
            if (this.robotList[i].x === x && this.robotList[i].y === y && this.robotList[i].type === RobotType.Scrap) {
                return false;
            }
        }

        return true;
    }

    // プレイヤーロボットの移動
    movePlayer(toward: RobotMove, width: number, height: number): boolean {
        let x = this.robotList[0].x;
        let y = this.robotList[0].y;
        switch (toward) {
            case RobotMove.Wait:
                break;
            case RobotMove.Teleport:
                do {
                    x = Math.floor((Math.random() * width) + 1);
                    y = Math.floor((Math.random() * height) + 1);
                } while (!this.canMove(x, y, width, height));
                break;
            case RobotMove.Up:
                y--;
                break;
            case RobotMove.Down:
                y++;
                break;
            case RobotMove.Left:
                x--;
                break;
            case RobotMove.Right:
                x++;
                break;
            case RobotMove.UpperLeft:
                x--;
                y--;
                break;
            case RobotMove.UpperRight:
                x++;
                y--;
                break;
            case RobotMove.LowerLeft:
                x--;
                y++;
                break;
            case RobotMove.LowerRight:
                x++;
                y++;
                break;
            case RobotMove.Unknown:
                return false;
        }
        if (!this.canMove(x, y, width, height)) {
            return false;
        }

        this.robotList[0].x = x;
        this.robotList[0].y = y;

        return true;
    }

    // プレイヤーを動かした後に敵を一マス動かす
    moveEnemey(): boolean {
        for (const item of this.robotList) {
            if (item.type === RobotType.Player || item.type === RobotType.Scrap) {
                continue;
            }
            // プレイヤーの位置に向かうように敵を一マス動かす
            if (this.robotList[0].x === item.x && this.robotList[0].y > item.y) {
                item.y++;
            } else if (this.robotList[0].x === item.x && this.robotList[0].y < item.y) {
                item.y--;
            } else if (this.robotList[0].x > item.x && this.robotList[0].y === item.y) {
                item.x++;
            } else if (this.robotList[0].x < item.x && this.robotList[0].y === item.y) {
                item.x--;
            } else if (this.robotList[0].x < item.x && this.robotList[0].y < item.y) {
                item.x--;
                item.y--;
            } else if (this.robotList[0].x < item.x && this.robotList[0].y > item.y) {
                item.x--;
                item.y++;
            } else if (this.robotList[0].x > item.x && this.robotList[0].y < item.y) {
                item.x++;
                item.y--;
            } else if (this.robotList[0].x > item.x && this.robotList[0].y > item.y) {
                item.x++;
                item.y++;
            }
        }

        // 敵同士が衝突したらスクラップにする
        const length = this.robotList.length
        for (let i = 1; i < length - 1; i++) {
            for (let j = i + 1; j < length; j++) {
                if ((this.robotList[i].x === this.robotList[j].x) && (this.robotList[i].y === this.robotList[j].y)) {
                    this.robotList[i].type = RobotType.Scrap;
                    this.robotList[j].type = RobotType.Scrap;
                }
            }
        }

        // プレイヤーと敵が衝突したらゲームオーバー
        for (let i = 1; i < length; i++) {
            if ((this.robotList[0].x === this.robotList[i].x && this.robotList[0].y === this.robotList[i].y)) {
                return false;
            }
        }

        return true;
    }

    // 全滅チェック
    wipeOut(): boolean {
        for (let i = 1; i < this.robotList.length; i++) {
            if (this.robotList[i].type === RobotType.Enemy) {
                return false;
            }
        }
        return true;
    }

    // 倒した敵の数
    countDeadEnemy(): number {
        const length = this.robotList.length;
        let count = 0;
        for (let i = 1; i < length; i++) {
            if (this.robotList[i].type === RobotType.Scrap) {
                count++;
            }
        }
        return count;
    }

    // 累計で倒した敵の数
    countTotalDeadEnemy(level: number): number {
        let total = 0;
        for (let l = level - 1; l > 0; l--) {
            total += l * 10;
        }
        return total + this.countDeadEnemy();
    }
}
