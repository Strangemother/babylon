# Scene

The core BABYLON scene is not altered. The scene always exists in your app instance `app.scene()`

## Click

You can listen for a click on the scene. The callback will provide the event and the element under the pointer.

```js
app.scene().onPointerDown = function(evt, item) {
    console.log(evt, item)
}
```

Some shortcuts exist within Garden to help with stacking many functions:

### SceneClick

The `SceneClick` class will add and remove callbacks for scene clicks. When creating a `SceneClick`, you can use `add`, `remove of the `sceneClickers`

```js
c=new SceneClick
c.on(function(){ console.log('clicked'); })

c2=new SceneClick
c2.on(function(){ console.log('clicked2'); })
```

Clicking an element on the screen will perform two console logs.

A `SceneClick` can be turned on and off

```js
c=new SceneClick
c.on(function(){ console.log('clicked'); })
c.off()
```

Scene click callbacks are held in `sceneClickers`

```js
clicker = new SceneClick
clicker.on()
callback = function(){ console.log('sceneClicker');
sceneClickers.onPointerUp.add(callback});
sceneClickers.onPointerDown.add(callback});
```

> The `click` functionality combines a `pointerUp` and `pointerDown` event. A click event will dispatch if both events match the same `item.id`


