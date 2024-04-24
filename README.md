
# AdataFlow


## 🚀 What is it?
A flexible JavaScript web framework for building modern looking websites and web applications, which supports custom components, server side rendering and much more...


## Features

- CSR - Client Side Rendering
- SSR - Server Side Rendeing
- Custom defined components
- Using JavaScript/Node.js
- Consistent style
- High performance

## Usage/Examples

```javascript
import AdataFlow from 'AdataFlow.min.js';

// Initialize framework with root page element
var framework = new AdataFlow(document);

// Register single component with name and function
// with its argument e which is the element with
// attributes in the source code
framework.component.register('SomeName', (e) => {
  var element = document.createElement('div');
  element.class = e.getAttribute('class');
  return element;
});

// Register component with name aliases
framework.component.register(['SomeName1','SomeName2'], (e) => {
  var element = document.createElement('div');
  element.class = e.getAttribute('class');
  return element;
});

// Render page
framework.render();
```


## Roadmap

- Additional browser support


## License

[MIT](https://choosealicense.com/licenses/mit/)

