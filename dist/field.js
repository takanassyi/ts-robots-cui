"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldCUI = void 0;
const robot_1 = require("./robot");
class FieldCUI {
    constructor() {
        this.width = 60;
        this.height = 20;
    }
    printField() {
        // tslint:disable-next-line: no-console
        console.clear();
        // top of field
        process.stdout.write("+");
        for (let i = 0; i < this.width; i++) {
            process.stdout.write("-");
        }
        process.stdout.write("+\n");
        // inside of field
        for (let j = 0; j < this.height; j++) {
            process.stdout.write("|");
            for (let i = 0; i < this.width; i++) {
                process.stdout.write(" ");
            }
            process.stdout.write("|\n");
        }
        // bottom of field
        process.stdout.write("+");
        for (let i = 0; i < this.width; i++) {
            process.stdout.write("-");
        }
        process.stdout.write("+");
    }
    printGuide(level, score) {
        // tslint:disable-next-line: variable-name
        const cursor_x = this.width + 3;
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
    printRobots(robotList) {
        for (const item of robotList) {
            process.stdout.cursorTo(item.x, item.y);
            if (item.type === robot_1.RobotType.Player) {
                // put player robot
                process.stdout.write('@');
            }
            else if (item.type === robot_1.RobotType.Enemy) {
                // put enemy robots
                process.stdout.write('+');
            }
            else if (item.type === robot_1.RobotType.Scrap) {
                // put scrap
                process.stdout.write('*');
            }
            else {
                ;
            }
        }
    }
}
exports.FieldCUI = FieldCUI;
