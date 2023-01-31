# simpledragger

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
