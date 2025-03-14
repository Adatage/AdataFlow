class PageBuilder {
    constructor(instance) {
        this.instance = instance;
    }

    build(content, fl = true) {
        if(fl)
            content = this.instance.parser.parse(content);
        var result = "";
        for(let tag of content) {
            let component;
            if(typeof this.instance.components[tag.tagName] != 'undefined') {
                component = new (this.instance.components[tag.tagName])({
                    attributes: tag.attributes
                });
                if(component.content.html.includes("{{@default}}"))
                    if(tag.content != null && tag.content.length > 0)
                        result += component.content.html.replace("{{@default}}", this.build(tag.content, false));
                    else
                        result += component.content.html.replace("{{@default}}", '');
                else
                    result += component.content.html;
                this.instance.styleManager.imports.push(...component.content.css.imports);
                this.instance.styleManager.vars = {
                    ...this.instance.styleManager.vars,
                    ...component.content.css.globals
                };
                this.instance.styleManager.css = {
                    ...this.instance.styleManager.css,
                    ...component.content.css.data
                };
                //JS process
            } else if(tag.tagName == "#text")
                result += tag.content;
            else {
                var attribs = "";
                Object.keys(tag.attributes).forEach((attName) => {
                    attribs += ` ${attName}="${tag.attributes[attName]}"`;
                });
                var bTag = `<${tag.tagName+attribs}>`;
                if(tag.content != null) {
                    bTag += this.build(tag.content, false);
                    bTag += `</${tag.tagName}>`;
                }
                result += bTag;
            }
        }
        result = this._findVariables(result);
        return result;
    }

    _findVariables(data) {
        let classMatch;
        while(classMatch = /\{\{(.*?)\}\}/g.exec(data)) {
            if(classMatch == null)
                break;

            var val = this._assignVariables(classMatch[1].charAt(0), classMatch[1].substring(1))

            data = data.replaceAll(classMatch[0], val);
        }
        return data;
    }

    _assignVariables(prefix, varName) {
        switch(prefix) {
            case '.':
            case '#':
                return this.instance.identifyManager.add(prefix+varName);
                break;
            case '!':

                break;
            case '?':
                if(this.instance.globalsVariables[varName])
                    return this.instance.globalsVariables[varName];
                this.instance.logger.log(1, "Building page with undefined global variable \""+varName+"\"");
                return '';
            case '@':

                break;
            default:
                this.instance.logger.log(1, "Building page with variable \""+varName+"\" without prefix");
                return '';
        }
    }
}

export default PageBuilder