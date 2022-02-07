declare type SimpleOutput = string;
declare type Output = {
    sensitive: boolean;
    type: string;
    value: string;
};
interface SimpleOutputObject {
    [k: string]: SimpleOutput;
}
interface OutputObject {
    [k: string]: Output;
}
declare type TerraformSingleOutput = Output;
declare type TerraformMultipleOutput = {
    [k: string]: Output;
};
declare type ResourceCounts = {
    addCount: number;
    changeCount: number;
    destroyCount: number;
};
declare enum ChangeTypes {
    PLAN = 0,
    ADDED = 1,
    DESTROYED = 2
}
export { ChangeTypes, ResourceCounts, TerraformMultipleOutput, TerraformSingleOutput, OutputObject, SimpleOutputObject, SimpleOutput, Output };
