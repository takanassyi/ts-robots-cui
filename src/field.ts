import { Robot, RobotInfo, RobotType } from "./robot"

export interface FieldSize {
    readonly width: number,
    readonly height: number,
}

export interface FieldMethod {
    printField(): void;
    printGuide(level: number, score: number): void;
    printRobots(robotList: RobotInfo[]): void;
}

export class FieldCUI implements FieldSize, FieldMethod {
    readonly width = 60;
    readonly height = 20;

    constructor() {
    }

    printField(): void {
        // tslint:disable-next-line: no-console
        console.clear()
        // top of field
        process.stdout.write("+")
        for (let i = 0; i < this.width; i++) {
            process.stdout.write("-")
        }
        process.stdout.write("+\n")

        // inside of field
        for (let j = 0; j < this.height; j++) {
            process.stdout.write("|")
            for (let i = 0; i < this.width; i++) {
                process.stdout.write(" ")
            }
            process.stdout.write("|\n")
        }

        // bottom of field
        process.stdout.write("+")
        for (let i = 0; i < this.width; i++) {
            process.stdout.write("-")
        }
        process.stdout.write("+")
    }

    printGuide(level: number, score: number): void {
        // tslint:disable-next-line: variable-name
        const cursor_x = this.width + 3
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

    printRobots(robotList: RobotInfo[]) {
        for (const item of robotList) {
            process.stdout.cursorTo(item.x, item.y)
            if (item.type === RobotType.Player) {
                // put player robot
                process.stdout.write('@')
            } else if (item.type === RobotType.Enemy) {
                // put enemy robots
                process.stdout.write('+')
            } else if (item.type === RobotType.Scrap) {
                // put scrap
                process.stdout.write('*')
            } else {
                ;
            }
        }
    }
}
