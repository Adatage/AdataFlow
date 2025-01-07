class PageBuilder {
    constructor(instance) {
        this.instance = instance;
    }

    build(content) {
        content = this.instance.parser.parse(content);
        for(let tag of content) {
            let component;
            if(typeof this.instance.components[tag.tagName] != 'undefined') {
                component = new (this.instance.components[tag.tagName])();
                console.log(component.content.html);
                if(tag.content != null && tag.content.length > 0 && component.content.html.includes("{{@default}}")) {
                    console.log("Supports childs!");
                }
            }
        }
        return content;
    }
}

export default PageBuilder