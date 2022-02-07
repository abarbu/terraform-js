"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
class Terragrunt extends Base_1.Base {
    constructor() {
        super('terragrunt', '--terragrunt-non-interactive');
        this.addTriggerWordForInteractiveMode('Are you sure you want to run \'terragrunt apply\' in each folder of the stack described above?');
        this.addTriggerWordForInteractiveMode('Are you sure you want to run \'terragrunt destroy\' in each folder of the stack described above?');
        this.addTriggerWordForInteractiveMode('Are you sure you want to run \'terragrunt plan\' in each folder of the stack described above?');
    }
    async applyAll(path, options = {}) {
        await this.executeInteractive('apply-all', path, options);
    }
    async destroyAll(path, options = {}) {
        await this.executeInteractive('destroy-all', path, options);
    }
    async planAll(path, options = {}) {
        await this.executeSync(path, 'plan-all', { silent: options.silent || false });
    }
    // public async outputAll(path: string, options: OutputOptions = {}): Promise<OutputObject[] | SimpleOutputObject[]> {
    //   // TODO add output function to filter, e.g. "databases_*"
    //   const parsedOptions = this.parseOutputOptions(options)
    //   const { stdout } = await this.executeSync(path, 'output-all -json', { silent: parsedOptions.silent })
    //   const outputs = <OutputObject[]>this.parseStdoutAsJson(stdout)
    //   if (parsedOptions.simple) {
    //     return outputs.map((output) => {
    //       const keys = Object.keys(output)
    //       const result = {}
    //       keys.forEach((key) => {
    //         result[key] = output[key].value
    //       })
    //       return result
    //     })
    //   }
    //   return outputs
    // }
    async output(path, options = {}) {
        const parsedOptions = this.parseOutputOptions(options);
        const { stdout } = await this.executeSync(path, 'output -json', { silent: parsedOptions.silent });
        const output = JSON.parse(stdout);
        if (options.simple) {
            const keys = Object.keys(output);
            keys.forEach((key) => {
                // @ts-ignore
                delete output[key].sensitive;
                // @ts-ignore
                delete output[key].type;
            });
        }
        return output;
    }
    async outputValue(path, value, options = {}) {
        const parsedOptions = this.parseOutputOptions(options);
        const { stdout } = await this.executeSync(path, `output -json ${value}`, { silent: parsedOptions.silent });
        const output = JSON.parse(stdout);
        if (parsedOptions.simple) {
            return output.value;
        }
        return output;
    }
    async getOutputKeys(path, options = {}) {
        const { stdout } = await this.executeSync(path, 'output -json', { silent: options.silent || true });
        const output = JSON.parse(stdout);
        return Object.keys(output);
    }
}
exports.Terragrunt = Terragrunt;
