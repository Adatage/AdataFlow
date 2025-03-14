class Styles {
    constructor(instance, options = {}) {
        this.instance = instance;

        this.options = options;
        this.css = {};
        this.vars = {};
        this.imports = [];
        this._wTempCss = "";
    }

    add(id, css = {}) {
        if(this.css[id] == null)
            this.css[id] = css;
        else
            Object.keys(css).forEach(key => this.css[id][key] = css[key]);
    }

    addVar(key, value) {
        vars[key] = value;
    }

    addVars(data) {
        this.vars = { ...this.vars, ...data };
    }

    importCSS(urls) {
        this.imports.push(...urls);
    }

    generateStyles(raw = false) {
        this._wTempCss = "";
        return this._buildStyle(this.css);
    }

    _buildStyle(css, parent = "") {
        var result = "";
        Object.keys(css).forEach((identificator) => {
            if(Object.keys(css[identificator]).length > 0) {
                var tempCSS = identificator;
                if(parent != "") {
                    tempCSS = parent.replaceAll('/', ' ');
                    tempCSS += (identificator.charAt(0) == ':' ? '' : ' ') + identificator;
                }
                tempCSS = this._replaceIdentificators(tempCSS) + "{";
                Object.keys(css[identificator]).forEach((cssKey) => {
                    if(typeof css[identificator][cssKey] == 'object')
                        this._buildStyle({ [cssKey]: css[identificator][cssKey] }, (parent == "" ? identificator : parent+"/"+identificator));
                    else
                        tempCSS += cssKey+":"+css[identificator][cssKey]+";";
                });
                tempCSS += "}";
                result += this._replaceVariables(tempCSS);
            }
        });
        this._wTempCss += result.replaceAll(", ", ',');
        return this._wTempCss;
    }

    _replaceIdentificators(path) {
        let match;
        while(match = /[.#]\w+(?=\s|:|$)/g.exec(path)) {
            if(match == null)
                break;
            var rIdentify = this.instance.identifyManager.get(match[0]);
            if(rIdentify.length == 0)
                rIdentify = match[0].substring(1);
            rIdentify = (match[0].charAt(0) == '.' ? "$c$" : (match[0].charAt(0) == '#' ? "$h$" : '')) + rIdentify;
            path = path.replaceAll(match[0], rIdentify);
        }
        return path.replaceAll("$c$", '.').replaceAll("$h$", '#');
    }

    _replaceVariables(value) {
        let match;
        while(match = /\[\[(.*?)\]\]/g.exec(value)) {
            if(match == null)
                break;
            value = value.replaceAll(match[0], (this.vars[match[1]] != null ? this.vars[match[1]] : 'unset'));
        }
        return value;
    }
}

export default Styles