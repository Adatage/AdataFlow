class PageBuilder {
    constructor(instance) {
        this.instance = instance;
    }

    build(content) {
        content = this.instance.parser.parse(content);
        return content;
    }
}

export default PageBuilder