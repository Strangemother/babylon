# Configuration

You can apply a master config to your game.

```js
CONFIG = {
    canvasName: '#renderCanvas'
    , size: [800, 600]
};

Garden.config(CONFIG)
let app = Garden.run()
```

## canvasName

Providing the target HTML canvas is defined in you main config

```HTML
<canvas id="renderCanvas" class="main-canvas"></canvas>
```

```js
CONFIG = {
    canvasName: '#renderCanvas'
};

Garden.config(CONFIG)
let app = Garden.run()
```

When omiting the `canvasName`, Garden will attempt to discover the referenced canvas using the name of the App class.


```HTML
<canvas id="MyGame" class="main-canvas"></canvas>
```

```js
class MyGame extends Garden {}

app = new MyGame();
```

If a name fails to resolve, `#garden` is used:


```HTML
<canvas id="garden" class="main-canvas"></canvas>
```

```js
let app = Garden.run()
```

## size

Specify the size of your canvas with a `size` array containing _width_ and _height_ as pixels:

```js
CONFIG = {
    size: [540, 480]
};

Garden.config(CONFIG)
let app = Garden.run()
```

If you omit the `size`, Garden will used the measured DOM of the canvas node. If you've positioned your canvas using CSS this is the best method.

The canvas width and height are measured on `run()`. The BABYLON scene will be correctly scaled.

> Changing the `size` after run will distort the canvas. You'll need to call the BABLYON `resize()` feature in fluid and responsive styles

If the canvas sizing is relative to the page, your scene will distort when the DOM changes. In this case you'll call BABYLON `resize()` method to correct the skew.


## appName

You can load and run many apps into Garden. Pick which app to load initially, using the `appName` value:

```js
CONFIG = {
    appName: 'Sandbox'
}

class SandBox extends Garden {}

Garden.register(Sandbox)

let app = Garden.run()
// run Sandbox
```

