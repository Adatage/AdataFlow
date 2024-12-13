class Styles {
    constructor(instance, options = {}) {
        this.instance = instance;

        this.options = options;
        this.css = {};
        this.vars = {};
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

    generateStyles(raw = false) {
        var resultCss = "";
        Object.keys(this.css).forEach((uuid) => {
            var css = "";
            Object.keys(this.css[uuid]).forEach((cssKey) => {
                if(typeof this.css[uuid][cssKey] != 'object') {
                    if(css.length == 0)
                            css += "." + uuid + '{';
                    else
                        css += ';';
                    css += cssKey.replaceAll('_','-') + ':' + this.css[uuid][cssKey];
                } else {
                    var subCss = "";
                    Object.keys(this.css[uuid][cssKey]).forEach((cssSubKey) => {
                        if(subCss.length == 0)
                            subCss += "}." + uuid + ':' + cssKey + '{';
                        else
                            subCss += ';';
                        subCss += cssSubKey.replaceAll('_','-') + ':' + this.css[uuid][cssKey][cssSubKey];
                    });
                    css += subCss;
                }
            });
            if(css.length != 0)
                css += '}';
            resultCss += css;
        });
        let varsMatch, temp = null;
        while(varsMatch = /\[\[(.*?)\]\]/g.exec(resultCss)) {
            if(varsMatch == null)
                break;
            temp = this.vars[varsMatch[1].replaceAll('-', '_')];
            resultCss = resultCss.replaceAll(varsMatch[0], (temp != null ? temp : 'unset'));
        }
        return raw ? resultCss : "<style>" + resultCss + "</style>";
    }
}

export default Styles