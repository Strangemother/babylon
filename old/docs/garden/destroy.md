# Destroy

The destruction routine is important to any application. Within graphical apps, its very important to destroy garbage. This includes visual and computational.

An app consists of:

```js
app = Garden.run(CONFIG)
app.children.add(app.lights.HemisphericLight)
```

The `CONFIG` is your main run configuration.

## destroy()

Every object in Garden has a `destroy()` method.

```js
app.box = new Sphere({
    color: 'dodgerBlue'
    , position: asVector(0, 2, 0)
});
app.box.addToScene();
```

Deleting an object correctly helps with garbage collection. The `box.destroy()` method will remove the BABYLON instance and attempt to remove the entity from the display list.

```js
app.box.destroy()
```

Be careful here, the original Garden instance `app.box` will exist. This should be deleted after your tear-down.

```js
delete app.box
// or maybe
app.box = undefined
```

This will release the Garden instance from the app. This doesn't mean the object is successfully garbage, you may have your own references to care for.

## destroyItem()

Removing the item using the `destroy` may not delete all references. To assist, the `app.destroyItem(name)` does a better job. If you've stored the Garden item into application instance, this will delete the root item.

```js
app.destroyItem('box2')
```

### How it works
To see how this works, we can inspect some of the internal variables. Every item applied through the Garden instance is applied to the displayList.

```js
app.box._displayListIndex
1
```

The returned index is the `displayListManager` reference. To see it's entry; we can look at the Garden `displaySets`.

```js
app.displayListManager._displaySets[app.children.id]
[ChildList, Array[1]]
```

The `ChildList` is the application class manager. This is `app.children`. The `Array` contains all the reference items

```js
app.displayListManager._displaySets[app.children.id][1][1]
[Box, Mesh, undefined]
```

Our Garden instance includes the `Box` Garden instance, `Mesh` BABYLON instance and `{}` an object of met configurations; in many cases the third argument is `undefined`.

Using `app.destroyItem(name)` Will remove the `displayListManager` reference and the original `app.box` instance and variable.

```js
app.destroyItem('box')
```

We can check the display list manager. An `undefined` will exist in the original position; `1`.

```js
app.displayListManager._displaySets[app.children.id][1][1]
undefined
```
