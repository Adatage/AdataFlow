import Styles from "./modules/Styles.js";
import Identificators from "./modules/Identificators.js";
import Parser from './modules/Parser.js';
import PageBuilder from './modules/PageBuilder.js';

class AdataFlowSSR {
    constructor(options = {}) {
        this._options = options;
        this.requestData = this._options.requestData;
        this.components = this._options.components;

        this.identifyManager = new Identificators(this);
        this.styleManager = new Styles(this, this._options.styles || {});
        this.parser = new Parser(this);
        this.builder = new PageBuilder(this);

        this.response = {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html;charset=utf-8"
            },
            content: ""
        };
    }

    _assignBracValues(i, j) {
        let classMatch;
        while(classMatch = /\{\{(.*?)\}\}/g.exec(i)) {
            if(classMatch == null)
                break;
            console.log(classMatch[0]);
            i = i.replaceAll(classMatch[0], this.identifyManager.add(j+classMatch[1]));
        }
        return i;
    }

    _processComponent(i) {
        i.create();
        i.content.html = this._assignBracValues(i.content.html, i.constructor.name+'/');
        Object.keys(i.content.css.data).forEach((identificator) => {
            var idTemp, idKtemp;
            if(identificator.includes("{{")) {
                idTemp = identificator
                idTemp = this._assignBracValues(idTemp, i.constructor.name+'/');
            } else
                idTemp = this.identifyManager.add(i.constructor.name+'/'+identificator.replaceAll('_', '-'));
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
            this.styleManager.vars = { ...this.styleManager.vars, ...i.content.css.globals };
        });
        Object.keys(i._childs).forEach((j) => {
            i._childs[j].forEach((k) => {
                if(i.content.html.includes("[["+j+"]]")) {
                    let child = this._processComponent(k);
                    i.content.html = i.content.html.replaceAll("[["+j+"]]", child.html);
                }
            });
        });
        return i.content;
    }

    setContent(content, variables) {
        var pageContent = this.builder.build(content);
        console.log(pageContent);
        //this.response.content = JSON.stringify(this.parser.parse(content));
        this.response.content = pageContent.replaceAll("\n", "").replaceAll("  ", "");
    }

    render() {
        //this.response.content = this.response.content.replaceAll("\n", "").replaceAll("  ", "");
        return this.response;
    }
}

export default AdataFlowSSR