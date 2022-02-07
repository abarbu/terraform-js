/// <reference types="node" />
import { Writable } from 'stream';
interface InteractiveOptions {
    autoApprove?: boolean;
    silent?: boolean;
}
interface DestroyOptions extends InteractiveOptions {
}
interface ApplyOptions extends InteractiveOptions {
}
interface ExecuteOptions {
    silent?: boolean;
}
interface StdInterface {
    stdout: string;
    stderr: string;
}
interface OutputOptions {
    silent?: boolean;
    simple?: boolean;
}
interface Logger {
    log: (data: string) => Promise<void>;
}
declare abstract class Base {
    private executableName;
    private autoApproveOptionName;
    private triggerWordsForInteractiveMode;
    private logger;
    private stdOutStream;
    private stdErrStream;
    constructor(executableName: string, autoApproveOptionName: string);
    setOutStreams(stdOutStream: Writable, stdErrStream: Writable): void;
    setLogger(logger: Logger): void;
    private log;
    protected executeSync(path: string, args: string, options: ExecuteOptions): Promise<StdInterface>;
    protected parseOutputOptions(input: OutputOptions): OutputOptions;
    protected addTriggerWordForInteractiveMode(word: string): void;
    private needsAnswer;
    private buildArgs;
    protected executeInteractive(baseCommand: string, path: string, options: InteractiveOptions): Promise<StdInterface>;
}
export { Base, ApplyOptions, OutputOptions, DestroyOptions, ExecuteOptions };
