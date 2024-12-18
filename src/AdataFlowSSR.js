import Styles from "./modules/Styles.js";
import Identificators from "./modules/Identificators.js";

class AdataFlowSSR {
    constructor(options = {}) {
        this._options = options;

        this._identifyManager = new Identificators(this);
        this.styleManager = new Styles(this, this._options.styles || {});

        this.statusCode = 200;
        this.headers = {
            "Content-Type": "text/html;charset=utf-8"
        };
        this.content = "";
    }

    _assignBracValues(i, j) {
        let classMatch;
        while(classMatch = /\{\{(.*?)\}\}/g.exec(i)) {
            if(classMatch == null)
                break;
            i = i.replaceAll(classMatch[0], this._identifyManager.add(j+classMatch[1]));
        }
        return i;
    }

    addContent(component) {
        if(typeof component != 'object' || typeof component.content != 'object')
            return;

        var processComponent = (i) => {
            i.create();
            i.content.html = this._assignBracValues(i.content.html, i.constructor.name+'/');
            Object.keys(i.content.css.data).forEach((identificator) => {
                var idTemp, idKtemp;
                if(identificator.includes("{{")) {
                    idTemp = identificator
                    idTemp = this._assignBracValues(idTemp, i.constructor.name+'/');
                } else
                    idTemp = this._identifyManager.add(i.constructor.name+'/'+identificator.replaceAll('_', '-'));
                Object.keys(i.content.css.data[identificator]).forEach((k) => {
                    if(k.includes("{{")) {
                        idKtemp = k;
                        idKtemp = this._assignBracValues(idKtemp, i.constructor.name+'/');
                        i.content.css.data[identificator][idKtemp] = i.content.css.data[identificator][k];
                        delete i.content.css.data[identificator][k];
                    }
                });
                this.styleManager.add(idTemp, i.content.css.data[identificator]);
                i.content.css.imports.forEach((imp) => {
                    if(!this.styleManager.imports.includes(imp))
                        this.styleManager.imports.push(imp);
                });
                this.styleManager.globals = { ...this.styleManager.globals, ...i.content.css.globals };
            });
            Object.keys(i._childs).forEach((j) => {
                i._childs[j].forEach((k) => {
                    if(i.content.html.includes("[["+j+"]]")) {
                        let child = processComponent(k);
                        i.content.html = i.content.html.replaceAll("[["+j+"]]", child.html);
                    }
                });
            });
            return i.content;
        };
        this.content = processComponent(component).html.replace("[[style]]", this.styleManager.generateStyles());
    }

    render() {
        return {
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.content.replaceAll("\n", "").replaceAll("  ", "")
        };
    }
}

export default AdataFlowSSR