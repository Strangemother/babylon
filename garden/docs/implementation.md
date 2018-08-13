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
