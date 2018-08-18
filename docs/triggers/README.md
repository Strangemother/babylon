# Triggers

A BABYLON Trigger performs execution of commands through an action register reference.

## Creating an Action

Lets look at the basic BABYLON register action. In this example, we can add a Sphere to the scene and apply a default click trigger:

```js
box = new Box();
box.addToScene();
pick = new PickTrigger();
action = pick.action(box._babylon)
// ExecuteCodeAction
```

Clicking the Scene Sphere will log `"Trigger"` to the console. This saves a few keystrokes for executing a function on an action.

You can alter the basic caller by providing a function `executeFunction`.

```js
let ball = new Sphere({ position: [1, 1, 1]});
let clickFunc = function(){
    console.log('Clicked');
};
ball.addToScene();
let pick = new PickTrigger(clickFunc);
let action = pick.action(ball._babylon)
// ExecuteCodeAction
```

With Garden Triggers, you can alter them after creation:

```js
pick.executeFunction = function(action){
    console.log('Changed!!');
}
```

Clicking the `ball` on the Scene will log `"Changed!!"` to the console.

## Add a Trigger

When applying a trigger, you're creating a Trigger, Action counterpart. Assign a new `Trigger` to the `trigger()` function on any Garden object.

```js
let box = new Box();
let mesh = box.addToScene()
let trigger = new PickTrigger(function(){ console.log('Picked', this); });
box.trigger(trigger)
```


## Key Triggers

Key input is an `OnKeyUpTrigger` of the scene. It's a common feature and Garden has a quick generator for a generic key input handler.

### KeyTrigger

The standard `KeyTrigger` monitors a single key and calls a function on key Up.

```
let keyTrigger = new KeyTrigger('r', function(){ console.log('Key', arguments) })
keyTrigger.action()
```

The KeyTrigger will enact on key `"r"` `keyUp`.

### KeyHandler

The generic KeyHandler class receives any key, calling your function upon each `keyUp`. It automatically assigns to the Scene, therefore you do not need `action()`.

```js
let k = new KeyHandler(function(action, evt, char){
    console.log('key hit', char);
});
```

Pressing any key on your Scene will log to the console. You can change the handling function using `handler` to set and get the `executeFunction`
```js
k.handler = function(a, e, c){ console.log('other key', c); }
```

## Usage

The `Trigger` class manages the calling of an action with BABYLON. The `action()` function recieves a BABYLON mesh or Garden BabylonObject type:

```js
let ball = new Sphere();
let mesh = ball.addToScene();
pick = new PickTrigger(function(){ console.log('Ball Clicked'); })
pick.action(ball);
// =? "Fetching _babylon from action object"
// ExecuteCodeAction
```

Or as a mesh:

```js
let ball = new Sphere();
let mesh = ball.addToScene();
pick = new PickTrigger(function(){ console.log('Ball Clicked'); });
pick.action(mesh);
// ExecuteCodeAction
```

> The ability to provide a `Garden` type rather than a `Babylon` type is unique to this `action()` function. Remember, Much of Garden works almost native to Babylon and would expect a BABYLON type.

Assign a new `Trigger` instance on a Garden object using the `trigger()` function:

```js
let box = new Box();
let mesh = box.addToScene()]
let trigger = new PickTrigger(function(){ console.log('Picked', this); });
box.trigger(trigger)
```

