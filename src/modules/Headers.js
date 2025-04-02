import Enums from "./Enums.js";
import Logger from "./Logger.js";

class Headers {
    constructor(instance) {
        this.instance = instance;
        this.logger = new Logger(instance, "Headers");
        this._headers = {};
    }

    load(headers) {
        if(typeof headers === 'string')
            this._fromString(headers);
        else if(typeof headers == 'object')
            this._fromObject(headers);
        else
            this.logger.log(Enums.ERROR, "Failed to parse header, unknown headers format");
    }

    set(header, value) {
        this._headers[header.toLowerCase()] = value;
    }

    get(header) {
        return this._headers[header.toLowerCase()];
    }

    _fromString(headers) {
        const lines = headers.split("\r\n");
        lines.forEach(line => {
            const [key, value] = line.split(' ');
            this._headers[key.trim().toLowerCase()] = value.trim();
        });
    }

    _fromObject(headers) {
        if(!Array.isArray(headers))
            Object.assign(this._headers, headers);
    }
}

export default Headers