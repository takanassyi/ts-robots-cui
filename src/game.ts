import { FieldCUI } from './field';
import { Robot, RobotMove } from './robot'

export class Game {
    level: number;
    score: number;

    constructor() {
        this.level = 1;
        this.score = 0;
    }
    // Robots Start
    start(): void {
        const robot = new Robot();
        const fieldCUI = new FieldCUI();
        robot.makeRobots(fieldCUI.width, fieldCUI.height, this.level);
        fieldCUI.printField();
        fieldCUI.printRobots(robot.robotList);
        fieldCUI.printGuide(this.level, this.score);

        // keypressライブラリを読み込む
        const keypress = require('keypress');
        // keypressを標準入力に設定
        keypress(process.stdin);
        process.stdin.on('keypress', (ch: any, key: any) => {
            let toward: RobotMove = RobotMove.Wait;
            switch (ch) {
                case 'y':
                    toward = RobotMove.UpperLeft;
                    break;
                case 'k':
                    toward = RobotMove.Up;
                    break;
                case 'u':
                    // 右上に1マス移動
                    toward = RobotMove.UpperRight;
                    break;
                case 'l':
                    // 右に1マス移動
                    toward = RobotMove.Right;
                    break;
                case 'n':
                    // 右下に1マス移動
                    toward = RobotMove.LowerRight;
                    break;
                case 'j':
                    // 下に1マス移動
                    toward = RobotMove.Down;
                    break;
                case 'b':
                    // 左下に1マス移動
                    toward = RobotMove.LowerLeft;
                    break;
                case 'h':
                    // 左に1マス移動
                    toward = RobotMove.Left;
                    break;
                case 'w':
                    // 待機
                    break;
                case 't':
                    // スクラップ以外にテレポート. 運が悪いと敵の隣にテレポートで即死.
                    toward = RobotMove.Teleport;
                    break;
                case 'q':
                    toward = RobotMove.Unknown;
                    process.stdin.pause();
                    break;
                default:
                    toward = RobotMove.Wait;
            }

            if (robot.movePlayer(toward, fieldCUI.width, fieldCUI.height)) {
                // ゲームオーバーのとき
                if (!robot.moveEnemey()) {
                    process.stdout.write("Game Over...\n");
                    process.stdin.pause();
                } else {
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
