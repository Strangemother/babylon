# Garden

The Garden class provides a quick boot method to start a scene of content. It's the `Base` class - named `Garden` for easy grabbing:

## Quick Start

```js
var app = new Garden();
app.run();
```

To start Garden without any code you can run:

```js
app = Garden.run(CONFIG)
app.children.add(Box)
```

All the tooling required lives within the `app` Garden instance.



## Class Application

The `Garden` class should be inherited, building your application into the class form. It makes for a fun API:

```js
class Sandbox extends Garden {

    start(){
        this._sphere = new Sphere({ color: 'green' });
        this._camera = new ArcRotateCamera();
        this._light = new HemisphericLight();

        this.children.addMany(this._sphere, this._light);
        this._camera.activate()
    }
}

;(function(){
    let app = window.app = new Sandbox(CONFIG);
    app.run()
})();
```

The `init` and `start` methods are automatic. Now you have a class based application ready to work.



## Basics

You're probably familiar with BABYLON. You'll need a `scene` and a background color:

**Scene**

```js
let scene = app.scene()
app.backgroundColor = colors.white()
```

**Light**

You'll always need to light your scene:
```js
let light = new HemisphericLight();
app.children.addMany(light);
```

**Camera**


Changing or applying a default camera is one line:

```js
let camera = new app.cameras.ArcRotateCamera(activate=true);
```

You can switch cameras on-the-fly:

```js
let camera = new app.cameras.ArcRotateCamera(true);
let freeCam = new app.cameras.FreeCamera({ position:asVector(1,0,1)) });
freeCam.activate()
```


**Box**

Add children to the scene:

```js
let mesh = app.children.add(new Box)
mesh.position.x = 2;
```
