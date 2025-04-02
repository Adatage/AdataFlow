class HTMLParser {
    constructor(instance) {
        this.instance = instance;
        this._regex = {
            comments: /<!--(.*?)-->/g,
            tags: /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
            attributes: /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(["']([^"']*)["']|\{([^}]*)\})/g,
            textContent: /<\/?[a-zA-Z][a-zA-Z0-9]*\b/,
            upperCase: /^[A-Z]/
        };
        this._nonPairElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"];
    }

    parse(html) {
        const ast = this._parse(html, {
            tagName: "!DOCTYPE html",
            props: {},
            pair: false,
            childs: []
        });
        return this._processComponents(ast);
    }

    stringify(node) {
        if(node.tagName === "#text") return node.text;
        if(node.tagName === "#comment") return `<!--${node.text}-->`;

        const propsString = Object.entries(node.props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ");
        const openTag = `<${node.tagName}${propsString ? " " + propsString : ""}>`;
        const closeTag = node.pair ? `</${node.tagName}>` : "";
        const content = node.childs ? node.childs.map((c) => this.stringify(c)).join("") : "";
        return `${openTag}${content}${closeTag}`;
    }

    _parse(html, root) {
        const stack = [root];
        let match;
        while((match = this._regex.tags.exec(html)) !== null) {
            const isClosing = match[0].includes('</');
            const selfClosing = match[0].includes('/>') || this._nonPairElements.includes(match[1]);
            const textContent = html.slice(this._regex.tags.lastIndex).split(this._regex.textContent)[0];

            if(isClosing)
                stack.pop();
            else {
                const tagObj = {
                    tagName: match[1],
                    props: this._parseProps(match[2]),
                    pair: !selfClosing,
                    childs: []
                };
                stack[stack.length - 1].childs.push(tagObj);
                if(!selfClosing)
                    stack.push(tagObj);
            }

            if(textContent.trim()) {
                const text = textContent.trim();
                let commentMatch;
                let lastIndex = 0;
                while((commentMatch = this._regex.comments.exec(text)) !== null) {
                    const beforeComment = text.slice(lastIndex, commentMatch.index);
                    const comment = commentMatch[0];
                    if(beforeComment)
                        stack[stack.length - 1].childs.push({
                            tagName: "#text",
                            text: beforeComment
                        });
                    stack[stack.length - 1].childs.push({
                        tagName: "#comment",
                        text: comment
                    });
                    lastIndex = this._regex.comments.lastIndex;
                }
                if(lastIndex < text.length)
                    stack[stack.length - 1].childs.push({
                        tagName: "#text",
                        text: text.slice(lastIndex)
                    });
                this._regex.tags.lastIndex += textContent.length;
            }
        }
        return root;
    }

    _parseProps(str, result = {}) {
        let subMatch;
        while((subMatch = this._regex.attributes.exec(str)) !== null) {
            let val = null;
            if(subMatch[3])
                val = subMatch[3];
            else if(subMatch[4])
                val = this._setProp(subMatch[1], subMatch[4]);
            if(val != null)
                result[subMatch[1]] = val;
        }
        return result;
    }

    _setProp(key, value) {
        return `__${value}`;
    }

    _processComponents(node) {
        if(!node.childs) return node;

        node.childs = node.childs.flatMap((child) => {
            if(this._regex.upperCase.test(child.tagName) && this.instance.components[child.tagName]) {
                const content = child.childs.map((c) => this.stringify(c)).join("");
                const renderedHTML = this.instance.components[child.tagName]({ ...child.props, _content: content });
                const parsedComponent = this.parse(renderedHTML);
                return parsedComponent.childs;
            } else if(child.childs && child.childs.length)
                return this._processComponents(child);
            else
                return child;
        });
        return node;
    }
}

export default HTMLParser