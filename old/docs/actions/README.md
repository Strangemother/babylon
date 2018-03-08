# Actions

An Action applies interaction to the Scene upon setting a `Trigger` to the `ActionManager`.

As example, writing an action to change the `"x"` position of a mesh when clicked:

```js
let box = new Box;
let mesh = box.addToScene();

let a = new InterpolateValueAction()
a.trigger(PickTrigger);
a.path('position.x');
a.value(3);
a.time(1000);

let action = a.action(mesh);
```

When using an Action class, you can generate Actions or register to the `mesh`. The `action` function creates a new BABYLON action. Providing a `mesh` will register the action.

This is easier to write if all prepared as one line:

```js
let box = new Box;
let mesh = box.addToScene();

let a = new InterpolateValueAction(PickTrigger, 'position.x', 3);
let action = a.action(mesh);
```
