import { Command } from "./Command";

export class OpenLoop {
    private static nextLoopID: number = 0;

    public type: string;
    public id: number;
    public name: string;
    public commands: Command[];

    public constructor(type: string) {
        this.type = type;
        this.id = OpenLoop.nextLoopID++;
        this.name = "";
        this.commands = [];
    }

    public ToString(): string {
        return this.capitalize(this.type) + this.id + this.name;
    }

    private capitalize(line: string): string {
        return line.substr(0, 1).toUpperCase + line.substr(1);
    }
}
