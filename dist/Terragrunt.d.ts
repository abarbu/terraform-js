import { Base, ApplyOptions, ExecuteOptions, OutputOptions, DestroyOptions } from './Base';
import { SimpleOutputObject, OutputObject, SimpleOutput, Output } from './Types';
declare class Terragrunt extends Base {
    constructor();
    applyAll(path: string, options?: ApplyOptions): Promise<void>;
    destroyAll(path: string, options?: DestroyOptions): Promise<void>;
    planAll(path: string, options?: ExecuteOptions): Promise<void>;
    output(path: string, options?: OutputOptions): Promise<SimpleOutputObject | OutputObject>;
    outputValue(path: string, value: string, options?: OutputOptions): Promise<SimpleOutput | Output>;
    getOutputKeys(path: string, options?: ExecuteOptions): Promise<string[]>;
}
export { Terragrunt };
