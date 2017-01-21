# Garden

The Garden class provides a quick boot method to start a scene of content. It's the `Base` class - named `Garden` for easy grabbing:

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

### Add a camera


Changing or applying a default camera is one line:

```js
let camera = new app.cameras.ArcRotateCamera(activate=true);
```

You can switch cameras on-the-fly:

```js
let camera = new app.cameras.ArcRotateCamera();
let freeCam = new app.cameras.FreeCamera({ position:asVector(1,0,1)) });
freeCam.activate()
```


## Extending

The `Garden` class should be inherited, building your application into the class form. It makes for a fun API:

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


## Many Apps

You may have many mini application you'll like to switch. Defining an _app_ is a great way to boot quick code:

```js
class App extends Garden {
    start() {
        this.ball = new Sphere({ color: 'red' })
    }
}

class Main extends Garden {};
class Sandbox extends Main {};

Garden.register(Main, App, Sandbox);
```

In this example, we've omited all the _running_ code for simplicity. Each `Garden` app has it's usual methods such as `init` and `start`.

When booting one application, you would write:

```js
var app = new Sandbox(CONFIG);
app.run()
```

With many apps, allow Garden to press run, you provide a preference of which app to boot:

```js
var app = new Garden(CONFIG)
app.run('Sandbox')
```

## Choosing an App

You can provide the initial choice using a few options.

+ **String**: Name of your class
+ **Class**: One of the originally `register()` apps.
+ **function**: Returning string or class.

The chosen initial app may be a reference within your `CONFIG`. Store any valid initial choice in `CONFIG.autoApp`

```js
let CONFIG = { autoApp: 'Main' };
var app = Garden.run(CONFIG);
// References CONFIG.autoApp == 'Main'
```

The `CONFIG` argument is optional to run. You can omit it from every call by applying `config` before `run()`

```js
Garden.config(CONFIG)
Garden.run('Sandbox')
```

#### Config

Run the chosen app through `config.appName`
```js
Garden.config({ appName: 'Sandbox' })
Garden.run()
```

#### String

Reference your initial app by string.

```js
var app = Garden.run('Sandbox'/*, CONFIG*/);
```

#### Class

Give the initial application as the class of original Reference:

```js
var app = Garden.run(Sandbox);
```

#### Function

If you need to decide when run, provide a function. The return value from the function can be any valid type:

```
var app = Garden.run(function() { return Sandbox });
```

### No App

Run Garden without an override of any type. Allowing for fast prototyping of ideas:

```
var app = Garden.run(CONFIG);
var scene = app.scene()
```
