class PageBuilder {
    constructor(instance) {
        this.instance = instance;
    }

    build(content) {
        content = this.instance.parser.parse(content);
        var result = "";
        for(let tag of content) {
            let component;
            if(typeof this.instance.components[tag.tagName] != 'undefined') {
                component = new (this.instance.components[tag.tagName])();
                if(tag.content != null && tag.content.length > 0 && component.content.html.includes("{{@default}}"))
                    content = component.content.html.replace("{{@default}}", this._buildRaw());
                else
                    content = component.content.html;
            } else {
                // build back the original element (HTML)
            }
        }
        return result;
    }

    _buildRaw(content) {
        
        return content;
    }
}

export default PageBuilder