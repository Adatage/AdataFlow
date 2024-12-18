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

    addContent(component) {
        if(typeof component != 'object' || typeof component.content != 'object')
            return;

        


        console.log((component));

        /*
        if(typeof component != 'object' || typeof component.get != 'function')
            return;
        var content = component.get();
        if(typeof content.css == 'object') {
            this.styleManager.addVars(content.css.globals);
            Object.keys(content.css.data).forEach((identificator) => {
                var idTemp;
                if(identificator.includes("{{")) {
                    idTemp = identificator
                    let classMatch;
                    while(classMatch = /\{\{(.*?)\}\}/g.exec(idTemp)) {
                        if(classMatch == null)
                            break;
                        idTemp = idTemp.replaceAll(classMatch[0], this._identifyManager.add(classMatch[1]));
                    }
                } else
                    idTemp = this._identifyManager.add(identificator.replaceAll('_', '-'));
                this.styleManager.add(idTemp, content.css.data[identificator]);
            });
        }
        if(typeof content.html == 'string')
            this.content += content.html;
        let classMatch;
        while(classMatch = /\{\{(.*?)\}\}/g.exec(this.content)) {
            if(classMatch == null)
                break;
            this.content = this.content.replaceAll(classMatch[0], this._identifyManager.add(classMatch[1]));
        }
        console.log(this.content);
        this.content.replace("[[style]]", this.styleManager.generateStyles());
        */
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