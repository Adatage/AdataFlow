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
        return result;
    }

    _buildRaw(content) {
        var result = "";
        for(let tag of content) {
            let component;
        }
        return content;
    }
}

export default PageBuilder