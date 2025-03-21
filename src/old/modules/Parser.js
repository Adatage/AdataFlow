class Parser {
    constructor(instance) {
        this.instance = instance;
    }

    parse(data) {
        return this._parseElem(data);
    }

    _parseElem(data) {
        var match, elements = [];
        const pairElementRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/gs;
        while((match = pairElementRegex.exec(data)) !== null) {
            const precedingText = data.slice(0, pairElementRegex.lastIndex - match[0].length);
            if(precedingText.trim())
                elements.push({
                    tagName: '#text',
                    content: precedingText.replace(/<[^>]*>/g, '').trim()
                });
            elements.push({
                tagName: match[1],
                attributes: this._parseAttributes(match[2].trim()),
                content: this._parseElem(match[3])
            });
            data = data.slice(pairElementRegex.lastIndex);
            pairElementRegex.lastIndex = 0;
        }
        if(data.trim())
            elements.push({
                tagName: '#text',
                content: data.replace(/<[^>]*>/g, '').trim()
            });
        const nonPairRegex = /(?<!<[^/>]*>)(<(\w+)([^>]*)\/>)(?![^<]*<\/\w+>)/g;
        while((match = nonPairRegex.exec(data)) !== null)
            elements.push({
                tagName: match[2],
                attributes: this._parseAttributes(match[3].trim()),
                content: null
            });
        return elements;
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