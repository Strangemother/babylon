# Garden

The Garden class provides a quick boot method to start a scene of content. It's the `Base` class - named `Garden` for easy grabbing:

```js
var app = new Garden();
app.run();
```

All the tooling required lives within the `app` Garden instance.

## Basics

You're probably familiar with BABYLON. You'll need a `scene` and a background color:

```js
let scene = app.scene()
app.backgroundColor = colors.white()
```

Add children to the scene:

```js
let mesh = app.children.add(new Box)
mesh.position.x = 2;

let light = new HemisphericLight();
app.children.addMany(light);
```

## Extending

The `Garden` class should be inherited, building your application into the class form. It makes for a fantastic API:

```js
class Sandbox extends Garden {
    init(config){
        super.init(config);
        this.run();
    }

    start(){
        this._sphere = new Sphere({ color: 'green' });
        this._camera = new ArcRotateCamera();
        this._light = new HemisphericLight();

        this.children.addMany(this._sphere, this._light);
        this._camera.activate()
    }
}

;(function(){
    window.app = new Sandbox(CONFIG);
})();
```

The `init` and `start` methods are automatic. Now you have a class based application ready to work.

---

The `Garden` class has many methods to help but they can get in the way of our own work. the underscore `_prefix` is useful but ugly.

```js
class Sandbox extends Garden.APP {}
```

The `APP` Postfix ensures the instance `this` scope is cleaner

