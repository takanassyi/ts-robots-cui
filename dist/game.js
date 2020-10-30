"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const field_1 = require("./field");
const robot_1 = require("./robot");
class Game {
    constructor() {
        this.level = 1;
        this.score = 0;
    }
    test() {
        const robot = new robot_1.Robot();
        let level = 1;
        let bonus_sum = 0;
        // level 1 開始時
        let score = 0;
        for (let le = level - 1; le > 0; le--) {
            bonus_sum += le * 100;
        }
        score = robot.countTotalDeadEnemy(level) * 10 + bonus_sum;
        console.log(`${level}::${score}`);
        // level 2 開始時 10体倒して 100点ボーナス
        bonus_sum = 0;
        level++;
        for (let le = level - 1; le > 0; le--) {
            bonus_sum += le * 100;
        }
        score = robot.countTotalDeadEnemy(level) * 10 + bonus_sum;
        console.log(`${level}::${score}`);
        // level 3 開始時 30体倒して 200点ボーナス
        bonus_sum = 0;
        level++;
        for (let le = level - 1; le > 0; le--) {
            bonus_sum += le * 100;
        }
        score = robot.countTotalDeadEnemy(level) * 10 + bonus_sum;
        console.log(`${level}::${score}`);
        bonus_sum = 0;
        level++;
        for (let le = level - 1; le > 0; le--) {
            bonus_sum += le * 100;
        }
        score = robot.countTotalDeadEnemy(level) * 10 + bonus_sum;
        console.log(`${level}::${score}`);
    }
    // Robots Start
    start() {
        const robot = new robot_1.Robot();
        const fieldCUI = new field_1.FieldCUI();
        robot.makeRobots(fieldCUI.width, fieldCUI.height, this.level);
        fieldCUI.printField();
        fieldCUI.printRobots(robot.robotList);
        fieldCUI.printGuide(this.level, this.score);
        // keypressライブラリを読み込む
        const keypress = require('keypress');
        // keypressを標準入力に設定
        keypress(process.stdin);
        let totalDeadEnemy = 0;
        process.stdin.on('keypress', (ch, key) => {
            let toward = robot_1.RobotMove.Wait;
            switch (ch) {
                case 'y':
                    toward = robot_1.RobotMove.UpperLeft;
                    break;
                case 'k':
                    toward = robot_1.RobotMove.Up;
                    break;
                case 'u':
                    // 右上に1マス移動
                    toward = robot_1.RobotMove.UpperRight;
                    break;
                case 'l':
                    // 右に1マス移動
                    toward = robot_1.RobotMove.Right;
                    break;
                case 'n':
                    // 右下に1マス移動
                    toward = robot_1.RobotMove.LowerRight;
                    break;
                case 'j':
                    // 下に1マス移動
                    toward = robot_1.RobotMove.Down;
                    break;
                case 'b':
                    // 左下に1マス移動
                    toward = robot_1.RobotMove.LowerLeft;
                    break;
                case 'h':
                    // 左に1マス移動
                    toward = robot_1.RobotMove.Left;
                    break;
                case 'w':
                    // 待機
                    break;
                case 't':
                    // スクラップ以外にテレポート. 運が悪いと敵の隣にテレポートで即死.
                    toward = robot_1.RobotMove.Teleport;
                    break;
                case 'q':
                    toward = robot_1.RobotMove.Unknown;
                    process.stdin.pause();
                    break;
                default:
                    toward = robot_1.RobotMove.Wait;
            }
            if (robot.movePlayer(toward, fieldCUI.width, fieldCUI.height)) {
                // ゲームオーバーのとき
                if (!robot.moveEnemey()) {
                    process.stdout.write("Game Over...\n");
                    process.stdin.pause();
                }
                else {
                    // 敵が全滅
                    if (robot.wipeOut()) {
                        robot.makeRobots(fieldCUI.width, fieldCUI.height, ++(this.level));
                    }
                    // ボーナス点を加味したスコア
                    let bonusSum = 0;
                    for (let level = this.level - 1; level > 0; level--) {
                        bonusSum += level * 100;
                    }
                    this.score = robot.countTotalDeadEnemy(this.level) * 10
                        + bonusSum;
                    // 画面表示
                    fieldCUI.printField();
                    fieldCUI.printRobots(robot.robotList);
                    fieldCUI.printGuide(this.level, this.score);
                }
            }
        });
        // プロセス実行中のキー入力を拾うように設定
        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
}
exports.Game = Game;
