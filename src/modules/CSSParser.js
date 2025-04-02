class CSSParser {
    constructor(instance) {
        this.instance = instance;
        this._regex = {
            imports: /@import\s+([^\s]+)\s*;?/g,
            rules: /([a-zA-Z0-9\-_#.\s,>+~*:]+)\s*\{([^}]+)\}/g,
            props: /([a-zA-Z0-9\-_]+)\s*:\s*([^;]+)\s*;/g,
            variables: /(--[a-zA-Z0-9\-_]+)\s*:\s*([^;]+)\s*;/g,
            keyFrames: /@keyframes\s+([a-zA-Z0-9\-_]+)\s*\{/g,
            keyFrameSteps: /([0-9.]+%?)\s*\{([^}]+)\}/g,
            mediaQueries: /@media\s*\((.*?)\)\s*{([^}]+)}/g
        };
    }

    parse(css) {
        return this._parse(css, {
            imports: [],
            variables: [],
            rules: [],
            keyFrames: [],
            mediaQueries: []
        });
    }

    _parse(css, root) {
        let importMatch;
        while((importMatch = this._regex.imports.exec(css)) !== null)
            root.imports.push(importMatch[1].trim().slice(0, -1));
        let ruleMatch;
        while((ruleMatch = this._regex.rules.exec(css)) !== null) {
            const declarations = ruleMatch[2].trim();
            const properties = [];
            let propMatch;
            while((propMatch = this._regex.props.exec(declarations)) !== null)
                properties.push({
                    property: propMatch[1].trim(),
                    value: propMatch[2].trim(),
                });
            root.rules.push({
                selector: ruleMatch[1].trim(),
                properties
            });
        }
        let variableMatch;
        while((variableMatch = this._regex.variables.exec(css)) !== null)
            root.variables.push({
                variable: variableMatch[1].trim(),
                value: variableMatch[2].trim(),
            });
        let keyframeMatch;
        while((keyframeMatch = this._regex.keyFrames.exec(css)) !== null) {
            const rulesBlock = css.slice(keyframeMatch.index+keyframeMatch[0].length).trim();
            const keyframeRules = [];
            let keyframeStepMatch;
            while((keyframeStepMatch = this._regex.keyFrameSteps.exec(rulesBlock)) !== null) {
                const declarations = keyframeStepMatch[2].trim();
                const properties = [];
                let keyPropMatch;
                while((keyPropMatch = this._regex.props.exec(declarations)) !== null)
                    properties.push({
                        property: keyPropMatch[1].trim(),
                        value: keyPropMatch[2].trim(),
                    });
                keyframeRules.push({
                    percentage: keyframeStepMatch[1].trim(),
                    rules: properties,
                });
            }
            root.keyFrames.push({
                name: keyframeMatch[1].trim(),
                rules: keyframeRules,
            });
        }
        let mediaMatch;
        while((mediaMatch = this._regex.mediaQueries.exec(css)) !== null) {
            const mediaBlock = css.slice(mediaMatch.index, mediaMatch.index+mediaMatch[0].length).trim();
            const openSlIndex = mediaBlock.indexOf("{");
            const query = mediaBlock.substring(mediaBlock.indexOf("@media")+6, openSlIndex).trim();
            const rulesBlock = mediaBlock.substring(openSlIndex+1);
            const rules = [];
            let mediaSelector;
            while((mediaSelector = this._regex.rules.exec(rulesBlock)) !== null) {
                const properties = [];
                let mediaProp;
                while((mediaProp = this._regex.props.exec(mediaSelector[2])) !== null)
                    properties.push({
                        property: mediaProp[1],
                        value: mediaProp[2]
                    });
                rules.push({
                    selector: mediaSelector[1].trim(),
                    properties
                });
            }
            root.mediaQueries.push({
                query,
                rules
            });
        }
        return root;
    }
}

export default CSSParser