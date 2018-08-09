# Scene Construct

A Scene is a working space full of 3D elements. Constructing a working Garden space entails starting the engine with a given target and pressing render as fast as possible. This can be done using the application base shortcuts or _Garden Patches_ for easy prototyping.

To step beyond the Garden framework, you'll prefer to press _run_ and _render_ without intervention. As an example, we can "boot" the engine and press _render_ a couple of times.

Garden is sub-divided into three abstract components. The `Application` for engine runtime and scene rendering, a `Garden` instance running an application engine, and your working logic we can define as `data` and or `Game` or whatever you're making.

The `Application` maintains a running engine. you can run an engine against a canvas with options.

    app = new Application
    app.run('renderCanvas', { size: [800, 600]})


Visually you'll see the canvas resize. Under the hood the running engine is setup, assets are loaded etc... Within the application instance, you'll see a `canvas`, `engine` and `scene` - Ooh and your `config`.


To render your scene:

    app.scene.render()


Urgh - you'll see the placeholder color (probably green.) Luckily one fundmental parameter exists for a scene. Alter the `clearColor` and press render again:

    app.scene.clearColor = colors.royalBlue()
    app.scene.render()
    app._renderLoopCounter
    1203


It's attractive but essentially useless. An unaltered Application instance as a counter, stepping for each `renderLoop()` call. You can replace this function:

    class MagicStardust extends Application {

        init() {
            this.myNewTicker = 0
        }

        renderLoop(){
            this.myNewTicker++
        }
    }

    app = new MagicStardust()
    app.scene.render()
    // ...


