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
    simpledragger(document.querySelector(".test"));
</script>
```

```js
// create a window (set width and height is a highly recommended)
const win = new simpledragger.Window("title", { width: "400px", height: "300px" });
win.html("<h1>hello, world</h1>");
```
