
export const FREE_VAR_KIND = -1;
export default class FreeVar {
    id: number;
    private static counter: number = 0;
    kind: number = -1;

    constructor() {
        this.id = FreeVar.getNextId();
    }

    toString(): string {
        return `_${this.id}`;
    }

    static getNextId(): number {
        return this.counter++;
    }

    static resetCounter() {
        this.counter = 0;
    }
}