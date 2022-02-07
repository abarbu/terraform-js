import { Base, ApplyOptions, OutputOptions, DestroyOptions, ExecuteOptions } from './Base';
import { SimpleOutputObject, OutputObject, SimpleOutput, Output, ResourceCounts } from './Types';
declare class Terraform extends Base {
    constructor();
    init(path: string, options?: ExecuteOptions): Promise<void>;
    output(path: string, options?: OutputOptions): Promise<SimpleOutputObject | OutputObject>;
    outputValue(path: string, value: string, options?: OutputOptions): Promise<SimpleOutput | Output>;
    getOutputKeys(path: string, options?: ExecuteOptions): Promise<string[]>;
    plan(path: string, options?: ExecuteOptions): Promise<ResourceCounts>;
    destroy(path: string, options?: DestroyOptions): Promise<ResourceCounts>;
    apply(path: string, options?: ApplyOptions): Promise<ResourceCounts>;
    private parseResourceChanges;
}
export { Terraform };
