import { HashMap } from "./HashMap";

export class Allocator {
    private static declarationMap: HashMap<string, Array<{ value: any, used: boolean }>>
        = new HashMap<string, Array<{ value: any, used: boolean }>>();

    public static AllocateDeclaration(varName: string, value?: any): void {
        if (this.declarationMap.Has(varName)) {
            let values: Array<{ value: any, used: boolean }> = this.declarationMap.Get(varName);
            values.push({ value: (value !== undefined ? value : null), used: false });
        } else {
            let values: Array<{ value: any, used: boolean }>
                = [{ value: (value !== undefined ? value : null), used: false }];
            this.declarationMap.Add(varName, values);
        }
    }

    public static GetValue(varName: string): any {
        if (this.declarationMap.Has(varName)) {
            let values: Array<{ value: any, used: boolean }> = this.declarationMap.Get(varName);
            values[values.length - 1].used = true;
            return values[values.length - 1].value;
        } else {
            return undefined;
        }
    }
}