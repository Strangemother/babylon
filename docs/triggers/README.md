# Triggers

A BABYLON Trigger performs execution of commands through a action register reference.

Lets look at the basic BABYLON register action. In this example, we can add a Sphere to the scene and apply a default click trigger:

```js
let ball = new Sphere();
let pick = new PickTrigger();
let action = pick.action(m._babylon)
// ExecuteCodeAction
```

Clicking the Scene Sphere will log `"Trigger"` to the console. This saves a few keystrokes for executing a function on an action.

You can alter the basic caller by providing a function executeFunction.

```js
let ball = new Sphere();
let clickFunc = function(){
    console.log('Clicked');
};
let pick = new PickTrigger(clickFunc);
let action = pick.action(m._babylon)
// ExecuteCodeAction
```




