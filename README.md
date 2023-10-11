# simpledragger

[![](https://img.shields.io/npm/v/simpledragger)](https://www.npmjs.com/package/simpledragger)
[![](https://badgen.net/packagephobia/install/simpledragger)](https://packagephobia.com/result?p=simpledragger)

add script tag to load the web-component

```html
<script src="https://unpkg.com/simpledragger" />
```

use the window component

```html
<simple-dragger-window onclose="e.target.remove()">
    <strong slot="title">draggable</strong>
    <p>not draggable</p>
</simple-dragger-window>
```

use the low-level component

```html
<simple-dragger>
    <strong data-draggable>draggable</strong>
    <hr />
    <p>not draggable</p>
</simple-dragger>
```

or use the low-level api

```html
<div class="test">
    <header data-draggable>
        <strong>draggable</strong>
    </header>
    <hr />
    <p>not draggable</p>
</div>

<script type="module">
    import { simpledragger } from "https://unpkg.com/simpledragger/dist/simpledragger.esm.js";
    // make an element draggable
    makeDraggable(document.querySelector(".test"), document.querySelector(".test > [data-draggable]"));
</script>
```
