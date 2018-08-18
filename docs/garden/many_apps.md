# Many Apps

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

## Finding and Switching Apps

When creating more than one application, you can gain access to the class through a range of styles. First you will have created more then one class extending `Garden`. Each class is registered with `Garden.register`:

```js
class Main extends Garden {};
class Sandbox extends Main {};

Garden.register(Main, Sandbox);
```

Once registered, you can switch and run each

```js
Garden.apps
["Main", "Sandbox"]
```

Pick and run an app

```js
Garden.Main()
```

Using the `switch` method, you can change the app on the fly.

```js
Garden.Main()
Garden.Sandbox()
```

This does rely upon usage of the `destroy` routine. An app is _switched_, performing a `reset(name)`

```js
Garden.switch('Sandbox')
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
