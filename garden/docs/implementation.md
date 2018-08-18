# Base setup

A Basic class setup includes the entity you'd like to run mounted into - or extending - Garden.

The fastest method with least code:

    class MyApp {
        init(){}
        render(){}

    }

    Garden.app = MyApp
    // config // anything
    Garden.run()

But to extend and build-up some of the internal features, you can alter to `extend` Garden:


    class MyApp extends Garden {

        init() {
            // configure
        }
        render()
        /* run() */
    }

    myapp = new MyApp()
    myapp.run()


# Config

Supply an initial config for the application to utilize during setup of core values.
If config is a function it's called expecting an object:

    class MyApp extends Garden {
        init() {
            this.config.width = 3
        }
    }

    class MyApp extends Garden {

        config(){
            return {
                width: 3
            }
        }
    }

configuration can occur through several methods, all combined to one object:

    app = new MyApp({ foo: 'bar' })
    app.run({foo: 'bar'})

## HTML Setup

Apply the `element` attribute to your config or an `app.element` for the target canvas name

Apply additional runtime values through the `run()` call:

    let app = new MyApp()
    app.run({ height: 6 })


In both examples, use the `config` like an object:

    start(){
        let width = this.config.width      // 3
            , height = this.config.height  // 6
        this.cube = new Cube({ width, height })
        this.cube.addToScene()
    }


# Rigging

A default scene requires a camera. Other optional extras include lighting and pre stage setup.
The `initialRig` function defines the basics, but can be overridden for a custom default layout


    class JustCubes extends Garden {

        initialRig(){
            this.sceneCamera = new RotateCamera()
            this.sceneLight = new HemiLight()
        }
    }


# Scenes

A single view is a 'scene'. A scene contains all 3D content. An initial scene is
produced to accept the `initialRig`.

    class CustomScene extends Garden {
        initialRig() {

        }
    }

## Scene Discovery.

Giving the 'scene' to a display object is a little tricky. An entity is a unit class

    cube = new Cube
    cube.addTo()

The scene instance should be given at some point:

    let scene = this.$r.main.scene
    new Cube({ scene })

Or at any configuration point before baking 'createMesh(bakedConfig, scene)'

    cube = new Cube
    cube.addToScene({ color: red, scene })

Add the scene automatically by utilizing the live load-in

    cube = new Cube(app)
    cube.addToScene(config)

With one app instance, the 'renderer' selection automatically selects the last.
This can save a few keystrokes:

    cube = new Cube()
    cube.addToScene()
    // app.getRenderer()

With more than one scene, the last generated app engine scene is used.
Add to a specific renderer:

    cube = new Cube()
    cube.addToScene('main')





A DisplayObject can be added to:

    'scene':        The garden app engines current webgl runtime loop
    app instance:   Apply to the instance of your app "cube.addTo(myapp)"
    display object: Another display object as a child "cube.addTo(ball)"
    a scene:        cube.addToScene(g.$r.main.scene), cube.addTo(g.$r.main.scene)



# Shapes

A Shape defines a single 3D object Abtract base to extend and utilize the LIB meshes.

    let cube = new Cube()
    cube.addToScene()

DisplayObject
    constructor - nothing but apply init config data given.
    init - auto ran for hooking constructor
    createMesh - Generate the object data ready for scene integration
    addTo X - Render to a scene

