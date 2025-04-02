import Enums from "./Enums.js";
import Utils from "./Utils.js";

class Logger {
    constructor(instance, module) {
        this.instance = instance;
        this.module = module;
    }

    log(level, text) {
        const datetime = Utils.formatDate("HH:MM:SS.II NN/AA/YY");
        const message = `[${datetime}] [${level.display}] [${this.module}] ${text}`;
    }
}

export default Logger