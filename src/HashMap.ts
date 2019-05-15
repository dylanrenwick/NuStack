export class HashMap<K, V> {
    private static readonly FNV_OFFSETS: { [key: number]: number } = {
        32: 0x811c9dc5,
        64: 0xcbf29ce484222325,
        128: 0x6c62272e07bb014262b821756295c58d,
        256: 0xdd268dbcaac550362d98c384c4e576ccc8b1536847b6bbb31023b4c8caee0535
    };

    private innerContainer: { [hash: string]: V };

    private hashBitDepth: number;

    public constructor(bitDepth: number = 32) {
        this.innerContainer = {};
        if (!HashMap.FNV_OFFSETS[bitDepth]) {
            throw new Error("" + bitDepth + " is not a valid bit depth, please choose a power of 2 greater than 16");
        }
        this.hashBitDepth = bitDepth;
    }

    public Add(key: K, value: V): void {
        let hash = HashMap.fnvHash(key, this.hashBitDepth);
        this.innerContainer[hash] = value;
    }

    public Get(key: K): V {
        let hash = HashMap.fnvHash(key, this.hashBitDepth);
        return this.innerContainer[hash];
    }

    public Has(key: K): boolean {
        let hash = HashMap.fnvHash(key, this.hashBitDepth);
        return this.innerContainer[hash] !== undefined
            && this.innerContainer[hash] !== null;
    }

    public GetValues(): V[] {
        return Object.values(this.innerContainer);
    }

    public static fnvHash(str: any, bitDepth: number): string {
        if (typeof(str) !== "string") {
            str = JSON.stringify(str);
        }

        let FNV1_32A_INIT: number = HashMap.FNV_OFFSETS[bitDepth];
        let hval: number = FNV1_32A_INIT;
        for (let i = 0; i < str.length; ++i) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return (hval >>> 0).toString(16);
    }
}
