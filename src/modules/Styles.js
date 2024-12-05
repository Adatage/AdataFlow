class Styles {
    constructor(instance, options = {}) {
        this.instance = instance;

        this.options = options;
        this.globalCSS = {};
        this.localCSS = {};
    }

    addGlobal(name, css = {}) {
        var id = this.instance.identifyManager.randName("_", 10);
        this.globalCSS[name] = {
            id,
            css
        };
        return id;
    }

    getGlobal(name) {
        return this.globalCSS[name].id;
    }

    add(css = {}) {
        var id = this.instance.identifyManager.randName("", 10);
        this.localCSS[id] = css;
        return id;
    }

    generateStyles(raw = false) {
        var temp = this.localCSS;
        var resultCss = "";
        Object.values(this.globalCSS).forEach((global) => temp[global.id] = global.css);
        Object.keys(this.localCSS).forEach((uuid) => {
            var css = "";
            Object.keys(this.localCSS[uuid]).forEach((cssKey) => {
                if(typeof this.localCSS[uuid][cssKey] != 'object') {
                    if(css.length == 0)
                        css += "." + uuid + '{';
                    else
                        css += ';';
                    css += cssKey.replaceAll('_','-') + ':' + this.localCSS[uuid][cssKey];
                } else {
                    var subCss = "";
                    Object.keys(this.localCSS[uuid][cssKey]).forEach((cssSubKey) => {
                        if(subCss.length == 0)
                            subCss += "}." + uuid + ':' + cssKey + '{';
                        else
                            subCss += ';';
                        subCss += cssSubKey.replaceAll('_','-') + ':' + this.localCSS[uuid][cssKey][cssSubKey];
                    });
                    css += subCss;
                }
            });
            if(css.length != 0)
                css += '}';
            resultCss += css;
        });
        return raw ? resultCss : "<style>" + resultCss + "</style>";
    }
}

export default Styles