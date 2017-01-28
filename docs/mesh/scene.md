# Scene

The core BABYLON scene is not altered. The scene always exists in your app instance `app.scene()`

### Click

You can listen for a click on the scene. The callback will provide the event and the element under the pointer.

```js
app.scene().onPointerDown = function(evt, item) {
    console.log(evt, item)
}
```
