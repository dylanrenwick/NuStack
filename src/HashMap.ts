import { sum } from "./HashSum";

export class HashMap<K, V> {
    private innerContainer: { [hash: string]: V };

    public constructor() {
        this.innerContainer = {};
    }

    public Add(key: K, value: V): void {
        let hash = sum(key);
        this.innerContainer[hash] = value;
    }

    public Get(key: K): V {
        let hash = sum(key);
        return this.innerContainer[hash];
    }

    public Has(key: K): boolean {
        let hash = sum(key);
        return this.innerContainer[hash] !== undefined
            && this.innerContainer[hash] !== null;
    }

    public GetValues(): V[] {
        return Object.values(this.innerContainer);
    }
}
