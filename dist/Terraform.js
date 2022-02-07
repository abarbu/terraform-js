"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Types_1 = require("./Types");
class Terraform extends Base_1.Base {
    constructor() {
        super('terraform', '-auto-approve');
        this.addTriggerWordForInteractiveMode('Only \'yes\' will be accepted to approve');
        this.addTriggerWordForInteractiveMode('Only \'yes\' will be accepted to confirm');
    }
    async init(path, options = { silent: true }) {
        await this.executeSync(path, 'init', { silent: options.silent });
    }
    async output(path, options = {}) {
        const parsedOptions = this.parseOutputOptions(options);
        const { stdout } = await this.executeSync(path, 'output -json', { silent: parsedOptions.silent });
        const output = JSON.parse(stdout);
        if (options.simple) {
            const keys = Object.keys(output);
            const result = {};
            keys.forEach((key) => {
                result[key] = output[key].value;
            });
            return result;
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
    async plan(path, options = {}) {
        const { stdout } = await this.executeSync(path, 'plan', { silent: options.silent || false });
        return this.parseResourceChanges(stdout, Types_1.ChangeTypes.PLAN);
    }
    async destroy(path, options = {}) {
        const { stdout } = await this.executeInteractive('destroy', path, options);
        return this.parseResourceChanges(stdout, Types_1.ChangeTypes.DESTROYED);
    }
    async apply(path, options = {}) {
        const { stdout } = await this.executeInteractive('apply', path, options);
        return this.parseResourceChanges(stdout, Types_1.ChangeTypes.ADDED);
    }
    parseResourceChanges(rawStringWithResourceChanges, command) {
        if (rawStringWithResourceChanges.includes('No changes')) {
            return {
                addCount: 0,
                changeCount: 0,
                destroyCount: 0
            };
        }
        let regexp = / /;
        switch (command) {
            case Types_1.ChangeTypes.PLAN:
                regexp = new RegExp('Plan: (\\d*) to add, (\\d*) to change, (\\d*) to destroy', 'gi');
                break;
            case Types_1.ChangeTypes.ADDED:
                regexp = new RegExp('Apply complete! Resources: (\\d*) added, (\\d*) changed, (\\d*) destroyed', 'gi');
                break;
            case Types_1.ChangeTypes.DESTROYED:
                regexp = new RegExp('Destroy complete! Resources: (\\d) destroyed');
                break;
        }
        const resourcesChangesWithoutStyles = rawStringWithResourceChanges.replace(/\u001b\[.*?m/g, '');
        const matches = regexp.exec(resourcesChangesWithoutStyles);
        if (matches) {
            if (command === Types_1.ChangeTypes.DESTROYED) {
                return {
                    addCount: 0,
                    changeCount: 0,
                    destroyCount: parseInt(matches[1], 10)
                };
            }
            return {
                addCount: parseInt(matches[1], 10),
                changeCount: parseInt(matches[2], 10),
                destroyCount: parseInt(matches[3], 10)
            };
        }
        throw new Error(`Could not extract added, changed and destroyed count with regexp ${regexp} from command ${rawStringWithResourceChanges}`);
    }
}
exports.Terraform = Terraform;
