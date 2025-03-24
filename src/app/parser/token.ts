export class Token {
    type: string[];
    value: any;
    length: number;

    constructor(type: string[], value: any, length: number) {
        this.type = type;
        this.value = value;
        this.length = length;
    }

    public isEqualType(types: string[]) {
        for (let t of this.type) {
            if (types.includes(t)) {
                return true;
            }
        }

        return false;
    }
}
