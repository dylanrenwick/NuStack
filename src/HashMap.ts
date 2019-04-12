import * as sum from "hash-sum";

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
}