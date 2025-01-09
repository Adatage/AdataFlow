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
                component = new (this.instance.components[tag.tagName])();
                if(component.content.html.includes("{{@default}}"))
                    if(tag.content != null && tag.content.length > 0)
                        result += component.content.html.replace("{{@default}}", this.build(tag.content, false));
                    else
                        result += component.content.html.replace("{{@default}}", '');
                else
                    result += component.content.html;
            } else {
                // build back the original element (HTML)
            }
        }
        result = this._assignVariables(result);
        return result;
    }

    _assignVariables(data) {
        let classMatch;
        while(classMatch = /\{\{(.*?)\}\}/g.exec(data)) {
            if(classMatch == null)
                break;
            console.log(classMatch);
            data = data.replaceAll(classMatch[0], '_____');
        }
        return data;
    }
}

export default PageBuilder