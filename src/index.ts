// フィールドの表示
function print_field(width: number, height: number) {
    // tslint:disable-next-line: no-console
    console.clear()
    // top of field
    process.stdout.write("+")
    for (let i = 0; i < width; i++) {
        process.stdout.write("-")
    }
    process.stdout.write("+\n")

    // inside of field
    for (let j = 0; j < height; j++) {
        process.stdout.write("|")
        for (let i = 0; i < width; i++) {
            process.stdout.write(" ")
        }
        process.stdout.write("|\n")
    }

    // bottom of field
    process.stdout.write("+")
    for (let i = 0; i < width; i++) {
        process.stdout.write("-")
    }
    process.stdout.write("+")
}

// 右端のゲームのガイドを表示
// tslint:disable-next-line: no-shadowed-variable
function print_guide(width: number, level: number, score: number) {
    // tslint:disable-next-line: variable-name
    const cursor_x = width + 3
    // tslint:disable-next-line: variable-name
    let cursor_y = 0

    process.stdout.cursorTo(cursor_x, cursor_y)
    process.stdout.write("\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    cursor_y++

    process.stdout.write("Directions:\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("y k u\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write(" \\|/\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("h- -l\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write(" /|\\ \n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("b j n\n\n")

    cursor_y++
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("Commands:\n\n")
    cursor_y++
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("w: wait for end\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("t: teleport\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("q: quit\n\n")

    cursor_y++
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("Legend:\n\n")
    cursor_y++
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("+: robot\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("*: junk heap\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("@: you\n\n")

    cursor_y++
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("Level:" + level + "\n\n")
    process.stdout.cursorTo(cursor_x, cursor_y++)
    process.stdout.write("Score:" + score + "\n\n")

}

// ロボットの種類（プレイヤー、敵、スクラップ）
enum type {
    Player,
    Enemy,
    Scrap
}

// ロボットのインタフェース
interface InterfaceRobot {
    // x座標
    x: number
    // y座標
    y: number
    // ロボットの種類
    type: type
}

// ロボットのタイプに応じて表示方法を変える
function put_robots(robots: InterfaceRobot[]) {
    for (const item of robots) {
        process.stdout.cursorTo(item.x, item.y)
        if (item.type === type.Player) {
            // put player robot
            process.stdout.write('@')
        } else if (item.type === type.Enemy) {
            // put enemy robots
            process.stdout.write('+')
        } else if (item.type === type.Scrap) {
            // put scrap
            process.stdout.write('*')
        } else {
            ;
        }
    }
}

// 指定した座標にスクラップが存在するか確認(プレイヤーロボットはスクラップの上に移動はできない)
function check_scrap(robots: InterfaceRobot[], x: number, y: number): boolean {
    for (let i = 1; i < robots.length; i++) {
        if (robots[i].x === x && robots[i].y === y && robots[i].type === type.Scrap) {
            return false
        }
    }
    return true
}

// 敵ロボットがいない場合クリア
function check_clear(robots: InterfaceRobot[]): boolean {
    for (let i = 1; i < robots.length; i++) {
        if (robots[i].type === type.Enemy) {
            return false
        }
    }
    return true
}

// 敵ロボットの移動、スクラップ確認、プレイヤーロボットと敵ロボット座標が一致したときゲームオーバー
function move_robots(robots: InterfaceRobot[]): boolean {
    for (const item of robots) {
        if (item.type === type.Player || item.type === type.Scrap) {
            continue
        }
        // プレイヤーの位置に向かうように敵を一マス動かす
        if (robots[0].x === item.x && robots[0].y > item.y) {
            item.y++
        } else if (robots[0].x === item.x && robots[0].y < item.y) {
            item.y--
        } else if (robots[0].x > item.x && robots[0].y === item.y) {
            item.x++
        } else if (robots[0].x < item.x && robots[0].y === item.y) {
            item.x--
        } else if (robots[0].x < item.x && robots[0].y < item.y) {
            item.x--
            item.y--
        } else if (robots[0].x < item.x && robots[0].y > item.y) {
            item.x--
            item.y++
        } else if (robots[0].x > item.x && robots[0].y < item.y) {
            item.x++
            item.y--
        } else if (robots[0].x > item.x && robots[0].y > item.y) {
            item.x++
            item.y++
        }
    }

    // check for scrap
    const length = robots.length
    for (let i = 1; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            if ((robots[i].x === robots[j].x) && (robots[i].y === robots[j].y)) {
                robots[i].type = type.Scrap
                robots[j].type = type.Scrap
            }
        }
    }

    // check gameover
    for (let i = 1; i < length; i++) {
        if ((robots[0].x === robots[i].x && robots[0].y === robots[i].y)) {
            return false
        }
    }

    return true
}

// スコアの計算 (スクラップ1体あたり10点)
function calc_score(robots: InterfaceRobot[]): number {
    const length = robots.length
    let count = 0
    for (let i = 1; i < length; i++) {
        if (robots[i].type === type.Scrap) {
            count++
        }
    }
    return count * 10
}

// 指定した座標にロボットがすでに配置されていないかチェック
function check_put_robots(robots: InterfaceRobot[], x: number, y: number): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < robots.length; i++) {
        if (x === robots[i].x && y === robots[i].y) {
            return false
        }
    }

    return true
}

// プレイヤーロボット、敵ロボットの初期配置
function make_robots(robots: InterfaceRobot[], width: number, height: number, level: number) {
    let x = Math.floor((Math.random() * width) + 1)
    let y = Math.floor((Math.random() * height) + 1)
    robots.push({ x, y, type: type.Player })

    const numOfEnemy = level * 10

    let count = 0
    while (count < numOfEnemy) {
        x = Math.floor((Math.random() * width) + 1)
        y = Math.floor((Math.random() * height) + 1)
        if (!check_put_robots(robots, x, y)) {
            // 同じ場所にロボットを置かない
            continue
        }
        robots.push({ x, y, type: type.Enemy })
        count++
    }
}

// main routine
function game_robots() {
    const width = 60
    const height = 20
    let level = 1
    let score = 0
    // tslint:disable-next-line: variable-name
    let sum_score = 0
    let robots: InterfaceRobot[]
    robots = []
    // robotsの0番目はPlayer 1番目からnumOfEnemy番目が敵ロボット
    make_robots(robots, width, height, level)
    print_field(width, height)
    put_robots(robots)
    print_guide(width, level, score)

    // keypressライブラリを読み込む
    const keypress = require('keypress')

    // keypressを標準入力に設定
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin)

    // keypressイベントの購読を開始
    // listen for the "keypress" event
    process.stdin.on('keypress', (ch: any, key: any) => {
        let inputCheck = true
        let x = robots[0].x
        let y = robots[0].y

        // 入力情報を取得
        switch (ch) {
            case 'y':
                // 左上に1マス移動
                if (x - 1 <= 0 || y - 1 <= 0 || !check_scrap(robots, x - 1, y - 1)) {
                    inputCheck = false
                    break;
                }
                robots[0].x--
            case 'k':
                // 上に1マス移動
                if (y - 1 <= 0 || !check_scrap(robots, robots[0].x, y - 1)) {
                    inputCheck = false
                    break;
                }
                robots[0].y--
                break
            case 'u':
                // 右上に1マス移動
                if (x + 1 >= width + 1 || y - 1 <= 0 || !check_scrap(robots, x + 1, y - 1)) {
                    inputCheck = false
                    break
                }
                robots[0].y--
            case 'l':
                // 右に1マス移動
                if (x + 1 >= width + 1 || !check_scrap(robots, x + 1, robots[0].y)) {
                    inputCheck = false
                    break
                }
                robots[0].x++
                break
            case 'n':
                // 右下に1マス移動
                if (x + 1 >= width + 1 || y + 1 >= height + 1 || !check_scrap(robots, x + 1, y + 1)) {
                    inputCheck = false
                    break
                }
                robots[0].x++
            case 'j':
                // 下に1マス移動
                if (y + 1 >= height + 1 || !check_scrap(robots, robots[0].x, y + 1)) {
                    inputCheck = false
                    break
                }
                robots[0].y++
                break
            case 'b':
                // 左下に1マス移動
                if (x - 1 <= 0 || y + 1 >= height + 1 || !check_scrap(robots, x - 1, y + 1)) {
                    inputCheck = false
                    break
                }
                robots[0].y++
            case 'h':
                // 左に1マス移動
                if (x - 1 <= 0 || !check_scrap(robots, x - 1, robots[0].y)) {
                    inputCheck = false
                    break
                }
                robots[0].x--
                break
            case 't':
                // スクラップ以外にテレポート. 運が悪いと敵の隣にテレポートで即死.
                do {
                    x = Math.floor((Math.random() * width) + 1)
                    y = Math.floor((Math.random() * height) + 1)
                } while (!check_scrap(robots, x, y))
                robots[0].x = x
                robots[0].y = y
                break
            case 'w':
                // 待機
                break
            case 'q':
                // 終了
                inputCheck = false
                process.stdin.pause()
                break
            default:
                inputCheck = false
        }
        // プレイヤーロボットを動かせたとき
        if (inputCheck) {
            if (!move_robots(robots)) {
                // ゲームオーバーのとき
                process.stdout.write("Game Over...\n")
                process.stdin.pause()
            } else {
                // プレイヤー、敵、スクラップ表示
                print_field(width, height)
                put_robots(robots)
                score = calc_score(robots)
                print_guide(width, level, sum_score + score)
                if (check_clear(robots)) {
                    // クリア判定
                    // レベルx100のボーナスポイント
                    sum_score += (score + level * 100)
                    // レベルアップステージ作成及び表示
                    robots = []
                    make_robots(robots, width, height, ++level)
                    print_field(width, height)
                    put_robots(robots)
                    print_guide(width, level, sum_score)
                }

            }

        }

    })

    // プロセス実行中のキー入力を拾うように設定
    process.stdin.setRawMode(true)
    process.stdin.resume()
}

game_robots()