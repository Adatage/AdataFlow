class Parser {
    constructor() {
        
    }

    parse(data) {
        return this._parseElem(data);
    }

    _parseElem(data) {
        var match, elements = [];
        const pairElementRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/gs;
        while((match = pairElementRegex.exec(data)) !== null)
            elements.push({
                tagName: match[1],
                attributes: this._parseAttributes(match[2].trim()),
                content: this._parseElem(match[3])
            });
        this._parseNonPairElem(data, elements);
        return elements;
    }

    _parseNonPairElem(data, elements) {
        var match;
        const nonPairRegex = /(?<!<[^/>]*>)(<(\w+)([^>]*)\/>)(?![^<]*<\/\w+>)/g;
        while((match = nonPairRegex.exec(data)) !== null)
            elements.push({
                tagName: match[2],
                attributes: this._parseAttributes(match[3].trim()),
                content: null
            });
    }

    _parseAttributes(data) {
        if(!data)
            return {};
        var match, attributes = {};
        const attrRegex = /(\w+)=["']([^"']*?(?:['()]+[^"']*?)*)["']/g;
        while((match = attrRegex.exec(data)) !== null)
            attributes[match[1]] = match[2];
        return attributes;
    }
}

export default Parser