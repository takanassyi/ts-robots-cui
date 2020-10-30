"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Robot = exports.RobotMove = exports.RobotType = void 0;
var RobotType;
(function (RobotType) {
    RobotType[RobotType["Player"] = 0] = "Player";
    RobotType[RobotType["Enemy"] = 1] = "Enemy";
    RobotType[RobotType["Scrap"] = 2] = "Scrap";
})(RobotType = exports.RobotType || (exports.RobotType = {}));
var RobotMove;
(function (RobotMove) {
    RobotMove[RobotMove["Teleport"] = 0] = "Teleport";
    RobotMove[RobotMove["Wait"] = 1] = "Wait";
    RobotMove[RobotMove["Left"] = 2] = "Left";
    RobotMove[RobotMove["Right"] = 3] = "Right";
    RobotMove[RobotMove["Down"] = 4] = "Down";
    RobotMove[RobotMove["Up"] = 5] = "Up";
    RobotMove[RobotMove["LowerLeft"] = 6] = "LowerLeft";
    RobotMove[RobotMove["LowerRight"] = 7] = "LowerRight";
    RobotMove[RobotMove["UpperLeft"] = 8] = "UpperLeft";
    RobotMove[RobotMove["UpperRight"] = 9] = "UpperRight";
    RobotMove[RobotMove["Unknown"] = 10] = "Unknown";
})(RobotMove = exports.RobotMove || (exports.RobotMove = {}));
class Robot {
    constructor() {
        this.robotList = [];
    }
    makeRobots(width, height, level) {
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
    canPutRobot(x, y) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.robotList.length; i++) {
            if (x === this.robotList[i].x && y === this.robotList[i].y) {
                return false;
            }
        }
        return true;
    }
    canMove(x, y, width, height) {
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
    movePlayer(toward, width, height) {
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
    moveEnemey() {
        for (const item of this.robotList) {
            if (item.type === RobotType.Player || item.type === RobotType.Scrap) {
                continue;
            }
            // プレイヤーの位置に向かうように敵を一マス動かす
            if (this.robotList[0].x === item.x && this.robotList[0].y > item.y) {
                item.y++;
            }
            else if (this.robotList[0].x === item.x && this.robotList[0].y < item.y) {
                item.y--;
            }
            else if (this.robotList[0].x > item.x && this.robotList[0].y === item.y) {
                item.x++;
            }
            else if (this.robotList[0].x < item.x && this.robotList[0].y === item.y) {
                item.x--;
            }
            else if (this.robotList[0].x < item.x && this.robotList[0].y < item.y) {
                item.x--;
                item.y--;
            }
            else if (this.robotList[0].x < item.x && this.robotList[0].y > item.y) {
                item.x--;
                item.y++;
            }
            else if (this.robotList[0].x > item.x && this.robotList[0].y < item.y) {
                item.x++;
                item.y--;
            }
            else if (this.robotList[0].x > item.x && this.robotList[0].y > item.y) {
                item.x++;
                item.y++;
            }
        }
        // 敵同士が衝突したらスクラップにする
        const length = this.robotList.length;
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
    wipeOut() {
        for (let i = 1; i < this.robotList.length; i++) {
            if (this.robotList[i].type === RobotType.Enemy) {
                return false;
            }
        }
        return true;
    }
    countDeadEnemy() {
        const length = this.robotList.length;
        let count = 0;
        for (let i = 1; i < length; i++) {
            if (this.robotList[i].type === RobotType.Scrap) {
                count++;
            }
        }
        return count;
    }
    countTotalDeadEnemy(level) {
        let total = 0;
        for (let l = level - 1; l > 0; l--) {
            total += l * 10;
        }
        return total + this.countDeadEnemy();
    }
}
exports.Robot = Robot;
