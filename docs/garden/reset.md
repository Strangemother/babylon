# Reset

App reset is a global destroy and reset of the `init` function.

Every Garden instance has a `destroy` method, including the Garden application

```
Garden.config({ globalName: 'app' })
Garden.run()
window.app
```

You'll notice the `globalName` creates a reference in the window. The `run()` method will write the Garden instance to `app`.

To destroy the application in full, use the `destroy` method

```js
app.destroy()
```

Everythin within garden is destroyed or reset. The references to the initial config and BABYLON are not deleted.

To start the application again you can use the `run` method

```js
newApp = app.run()
```

The run will return the application. Luckily `globalName` ensures the original `app` reference is changed. In this example `newApp` and `app` are the same.

If you did not use `globalName`, you'll need to ensure the original application reference is deleted.

To ensure this occurs safely, allow Garden to maintain the global reference, and re-run the application

```js
Garden.config({ globalName: 'app' })
Garden.run()
app.children.add(Box)
app.destroy()
```

Re-run the application with `Garden.run` and you will ensure `app` is the new instance. As a bonus, if you're running multiple applications, you can re-run a new app:

```js

class Sandbox1 extends Garden {}
class Sandbox2 extends Garden {}

Garden.register(Sandbox1, Sandbox2)

Garden.config({ globalName: 'app', appName: 'Sandbox1' })
Garden.run()
Garden.destroy()

Garden.run("Sandbox2")
```

