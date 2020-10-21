"use strict";
function print_field(width, height) {
    // tslint:disable-next-line: no-console
    console.clear();
    // top of field
    process.stdout.write("+");
    for (let i = 0; i < width; i++) {
        process.stdout.write("-");
    }
    process.stdout.write("+\n");
    // inside of field
    for (let j = 0; j < height; j++) {
        process.stdout.write("|");
        for (let i = 0; i < width; i++) {
            process.stdout.write(" ");
        }
        process.stdout.write("|\n");
    }
    // bottom of field
    process.stdout.write("+");
    for (let i = 0; i < width; i++) {
        process.stdout.write("-");
    }
    process.stdout.write("+");
}
// tslint:disable-next-line: no-shadowed-variable
function print_guide(width, level, score) {
    // tslint:disable-next-line: variable-name
    const cursor_x = width + 3;
    // tslint:disable-next-line: variable-name
    let cursor_y = 0;
    process.stdout.cursorTo(cursor_x, cursor_y);
    process.stdout.write("\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    cursor_y++;
    process.stdout.write("Directions:\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("y k u\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write(" \\|/\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("h- -l\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write(" /|\\ \n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("b j n\n\n");
    cursor_y++;
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("Commands:\n\n");
    cursor_y++;
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("w: wait for end\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("t: teleport\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("q: quit\n\n");
    cursor_y++;
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("Legend:\n\n");
    cursor_y++;
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("+: robot\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("*: junk heap\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("@: you\n\n");
    cursor_y++;
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("Level:" + level + "\n\n");
    process.stdout.cursorTo(cursor_x, cursor_y++);
    process.stdout.write("Score:" + score + "\n\n");
}
var type;
(function (type) {
    type[type["Player"] = 0] = "Player";
    type[type["Enemy"] = 1] = "Enemy";
    type[type["Scrap"] = 2] = "Scrap";
})(type || (type = {}));
// ロボットリストにして渡す?
function put_robots(robots) {
    for (const item of robots) {
        process.stdout.cursorTo(item.x, item.y);
        if (item.type === type.Player) {
            // put player robot
            process.stdout.write('@');
        }
        else if (item.type === type.Enemy) {
            // put enemy robots
            process.stdout.write('+');
        }
        else if (item.type === type.Scrap) {
            // put scrap
            process.stdout.write('*');
        }
        else {
            ;
        }
    }
}
function check_scrap(robots, x, y) {
    for (let i = 1; i < robots.length; i++) {
        if (robots[i].x === x && robots[i].y === y && robots[i].type === type.Scrap) {
            return false;
        }
    }
    return true;
}
function check_clear(robots) {
    for (let i = 1; i < robots.length; i++) {
        if (robots[i].type === type.Enemy) {
            return false;
        }
    }
    return true;
}
function move_robots(robots) {
    for (const item of robots) {
        if (item.type === type.Player || item.type === type.Scrap) {
            continue;
        }
        // プレイヤーの位置に向かうように敵を一マス動かす
        if (robots[0].x === item.x && robots[0].y > item.y) {
            item.y++;
        }
        else if (robots[0].x === item.x && robots[0].y < item.y) {
            item.y--;
        }
        else if (robots[0].x > item.x && robots[0].y === item.y) {
            item.x++;
        }
        else if (robots[0].x < item.x && robots[0].y === item.y) {
            item.x--;
        }
        else if (robots[0].x < item.x && robots[0].y < item.y) {
            item.x--;
            item.y--;
        }
        else if (robots[0].x < item.x && robots[0].y > item.y) {
            item.x--;
            item.y++;
        }
        else if (robots[0].x > item.x && robots[0].y < item.y) {
            item.x++;
            item.y--;
        }
        else if (robots[0].x > item.x && robots[0].y > item.y) {
            item.x++;
            item.y++;
        }
    }
    // check for scrap
    const length = robots.length;
    for (let i = 1; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            if ((robots[i].x === robots[j].x) && (robots[i].y === robots[j].y)) {
                robots[i].type = type.Scrap;
                robots[j].type = type.Scrap;
            }
        }
    }
    // check gameover
    for (let i = 1; i < length; i++) {
        if ((robots[0].x === robots[i].x && robots[0].y === robots[i].y)) {
            return false;
        }
    }
    return true;
}
function calc_score(robots) {
    const length = robots.length;
    let count = 0;
    for (let i = 1; i < length; i++) {
        if (robots[i].type === type.Scrap) {
            count++;
        }
    }
    return count * 10;
}
function check_put_robots(robots, x, y) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < robots.length; i++) {
        if (x === robots[i].x && y === robots[i].y) {
            return false;
        }
    }
    return true;
}
function make_robots(robots, width, height, level) {
    /**
     * make_robots()
     */
    let x = Math.floor((Math.random() * width) + 1);
    let y = Math.floor((Math.random() * height) + 1);
    robots.push({ x, y, type: type.Player });
    const numOfEnemy = level * 10;
    let count = 0;
    while (count < numOfEnemy) {
        x = Math.floor((Math.random() * width) + 1);
        y = Math.floor((Math.random() * height) + 1);
        if (!check_put_robots(robots, x, y)) {
            continue;
        }
        robots.push({ x, y, type: type.Enemy });
        count++;
    }
}
// main routine
function game_robots() {
    const width = 60;
    const height = 20;
    let level = 1;
    let score = 0;
    let sum_score = 0;
    let robots;
    robots = [];
    // robotsの0番目はPlayer 1番目からnumOfEnemy番目が敵ロボット
    make_robots(robots, width, height, level);
    print_field(width, height);
    put_robots(robots);
    print_guide(width, level, score);
    // keypressライブラリを読み込む
    const keypress = require('keypress');
    // keypressを標準入力に設定
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);
    // keypressイベントの購読を開始
    // listen for the "keypress" event
    process.stdin.on('keypress', (ch, key) => {
        let inputCheck = true;
        let x = robots[0].x;
        let y = robots[0].y;
        // 入力情報を取得
        switch (ch) {
            case 'y':
                if (x - 1 <= 0 || y - 1 <= 0 || !check_scrap(robots, x - 1, y - 1)) {
                    inputCheck = false;
                    break;
                }
                robots[0].x--;
            case 'k':
                if (y - 1 <= 0 || !check_scrap(robots, robots[0].x, y - 1)) {
                    inputCheck = false;
                    break;
                }
                robots[0].y--;
                break;
            case 'u':
                if (x + 1 >= width + 1 || y - 1 <= 0 || !check_scrap(robots, x + 1, y - 1)) {
                    inputCheck = false;
                    break;
                }
                robots[0].y--;
            case 'l':
                if (x + 1 >= width + 1 || !check_scrap(robots, x + 1, robots[0].y)) {
                    inputCheck = false;
                    break;
                }
                robots[0].x++;
                break;
            case 'n':
                if (x + 1 >= width + 1 || y + 1 >= height + 1 || !check_scrap(robots, x + 1, y + 1)) {
                    inputCheck = false;
                    break;
                }
                robots[0].x++;
            case 'j':
                if (y + 1 >= height + 1 || !check_scrap(robots, robots[0].x, y + 1)) {
                    inputCheck = false;
                    break;
                }
                robots[0].y++;
                break;
            case 'b':
                if (x - 1 <= 0 || y + 1 >= height + 1 || !check_scrap(robots, x - 1, y + 1)) {
                    inputCheck = false;
                    break;
                }
                robots[0].y++;
            case 'h':
                if (x - 1 <= 0 || !check_scrap(robots, x - 1, robots[0].y)) {
                    inputCheck = false;
                    break;
                }
                robots[0].x--;
                break;
            case 't':
                // スクラップ以外にテレポート
                do {
                    x = Math.floor((Math.random() * width) + 1);
                    y = Math.floor((Math.random() * height) + 1);
                } while (!check_scrap(robots, x, y));
                robots[0].x = x;
                robots[0].y = y;
                break;
            case 'w':
                break;
            case 'q':
                inputCheck = false;
                process.stdin.pause();
                break;
            default:
                inputCheck = false;
        }
        if (inputCheck) {
            if (!move_robots(robots)) {
                process.stdout.write("Game Over...\n");
                process.stdin.pause();
            }
            else {
                print_field(width, height);
                put_robots(robots);
                score = calc_score(robots);
                print_guide(width, level, sum_score + score);
                if (check_clear(robots)) {
                    sum_score += (score + level * 100);
                    //bonus_score += (level * 100)
                    robots = [];
                    make_robots(robots, width, height, ++level);
                    print_field(width, height);
                    put_robots(robots);
                    print_guide(width, level, sum_score);
                }
            }
        }
    });
    // プロセス実行中のキー入力を拾うように設定
    process.stdin.setRawMode(true);
    process.stdin.resume();
}
game_robots();
//# sourceMappingURL=index.js.map