"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class Base {
    constructor(executableName, autoApproveOptionName) {
        this.executableName = executableName;
        this.autoApproveOptionName = autoApproveOptionName;
        this.needsAnswer = (inputData) => {
            // TODO rework to iterate through this.triggerWordsForInteractiveMode, to abort early?
            let needsAnswer = false;
            this.triggerWordsForInteractiveMode.forEach((text) => {
                if (inputData.includes(text)) {
                    needsAnswer = true;
                }
            });
            return needsAnswer;
        };
        this.buildArgs = (baseCommand, options) => {
            const basicArgs = [baseCommand];
            if (options.autoApprove) {
                basicArgs.push(this.autoApproveOptionName);
            }
            return basicArgs;
        };
        this.triggerWordsForInteractiveMode = [];
        this.logger = {
            log: async (data) => {
                console.log(data);
            }
        };
        this.stdErrStream = process.stderr;
        this.stdOutStream = process.stdout;
    }
    setOutStreams(stdOutStream, stdErrStream) {
        this.stdErrStream = stdErrStream;
        this.stdOutStream = stdOutStream;
    }
    setLogger(logger) {
        this.logger = logger;
    }
    async log(data, silent = true) {
        if (!silent) {
            await this.logger.log(data);
        }
    }
    async executeSync(path, args, options) {
        return new Promise((resolve, reject) => {
            child_process_1.exec(`${this.executableName} ${args}`, {
                cwd: `${path}`
            }, async (err, stdout, stderr) => {
                if (err) {
                    await this.log(stderr, options.silent);
                    return reject(err);
                }
                await this.log(stderr, options.silent);
                await this.log(stdout, options.silent);
                return resolve({ stderr, stdout });
            });
        });
    }
    parseOutputOptions(input) {
        const options = {
            silent: true,
            simple: true
        };
        if (typeof input.silent !== 'undefined') {
            options.silent = input.silent;
        }
        if (typeof input.simple !== 'undefined') {
            options.simple = input.simple;
        }
        return options;
    }
    addTriggerWordForInteractiveMode(word) {
        this.triggerWordsForInteractiveMode.push(word);
    }
    executeInteractive(baseCommand, path, options) {
        if (options.silent && options.autoApprove === false) {
            return Promise.reject('Silent set to "true" and having autoApprove at "false" is not supported');
        }
        return new Promise((resolve, reject) => {
            let stdinPiped = false;
            const args = this.buildArgs(baseCommand, options);
            const executable = child_process_1.spawn(this.executableName, args, {
                cwd: `${path}`
            });
            if (!options.silent) {
                executable.stderr.pipe(this.stdErrStream);
                executable.stdout.pipe(this.stdOutStream);
            }
            let aggregatedStdOut = '';
            let aggregatedStdErr = '';
            executable.stdout.on('data', (data) => {
                aggregatedStdOut += data;
                if (this.needsAnswer(data)) {
                    stdinPiped = true;
                    process.stdin.pipe(executable.stdin);
                }
            });
            executable.stderr.on('data', (data) => {
                aggregatedStdErr += data;
                if (this.needsAnswer(data)) {
                    stdinPiped = true;
                    process.stdin.pipe(executable.stdin);
                }
            });
            // on('exit') is always called before onClose, so we do not need on('exit') handler
            // on('error') handler is never called
            executable.on('close', (code) => {
                if (stdinPiped) {
                    process.stdin.unpipe(executable.stdin);
                    process.stdin.destroy();
                }
                if (code !== 0) {
                    // TODO throw a nice error hier
                    return reject();
                }
                if (!options.silent) {
                    executable.stderr.unpipe(this.stdErrStream);
                    executable.stdout.unpipe(this.stdOutStream);
                }
                return resolve({ stdout: aggregatedStdOut, stderr: aggregatedStdErr });
            });
        });
    }
}
exports.Base = Base;
