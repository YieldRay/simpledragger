# simpledragger

[![](https://img.shields.io/npm/v/simpledragger)](https://www.npmjs.com/package/simpledragger)
[![](https://badgen.net/packagephobia/install/simpledragger)](https://packagephobia.com/result?p=simpledragger)

```html
<body>
    <div class="test">
        <header data-draggable>
            <strong>draggable</strong>
        </header>
        <hr />
        <p>not draggable</p>
    </div>
</body>

<script>
    // make an element draggable
    const test = document.querySelector(".test");
    simpledragger(test);
</script>
```

```js
// create a window
const win = new simpledragger.Window("title");
win.html("hello, world");
```
