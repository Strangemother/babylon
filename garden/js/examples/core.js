//LIB = BABYLON
class ManualSetup {
    /* User extendable application designed for clean implementation
    of a Garden rendering host.
    Utilize two canvases, storing each as an 'app'. Mount and create a default
    camera. Finally call render to punt the colours to the scene.

        g = new ManualSetup
        g.init()
        g.render()
    */

    init(){
        this.renderer = new StartFunctionRender('renderCanvas', {
            size: [500, 400]
            , sceneColor: 'lightBlue'

            /* Bind the loop render function to the Renderer.
            This function will update the scene at 60fps.*/

            /*
                BUG!
                Providing a render function in any form here
                will speed up the renderloop and alter the motion inertia.
                ... I don't know why!

                Ficed!!! Double frame calling...
             */
            , render: this.myFancyRender.bind(this)
        })


        this.renderer2 = new StartFunctionRender('otherCanvas', {
            size: [500, 400]
            , sceneColor: 'darkSlateBlue'

            /* Bind the loop render function to the Renderer.
            This function will update the scene at 60fps.*/

            , render: (s) => s.render() // this.render.bind(this)
        })

        this.renderer.mount()
        this.renderer2.mount()
        this.makeCamera(this.renderer)
        this.makeCamera(this.renderer2)
    }

    myFancyRender(scene){
        /*
         An open 'render' function for your looping scene. A default render function
         will call the attached app.scene render() function and any hooked functions
         for update at FPS speed.

         Because this example has two apps; we override to render two scenes.
         */

        //this.renderer.scene.render()
        //this.renderer2.scene.render()
        scene.render()
    }

    makeCamera(renderer){
        /*
         An rendererlication requires a camera from the first render. A Default 'freecamera'
         generates the basic camera. Override the default camera in the `makeCamera` function.
         Attaching a custom first camera to the scene.

         At any point a new camera can be created and attach to a scene - allowing for a
         multi-camera setup.
         */
        // Add a camera to the scene and attach it to the canvas
        var camera = new LIB.ArcRotateCamera("Camera"
                , Math.PI / 2, Math.PI / 2, 2
                , LIB.Vector3.Zero()
                , renderer.scene
            )
        camera.attachControl(renderer.canvas, true);
        renderer.camera = camera
    }
}


class CoreLibrary extends ManualSetup {
    /* Using the base architecture, render to two independent scenes

        g = new CoreManualSetup
        g.init()
        g.start()

     */
    start(){
        this.sphere = LIB.MeshBuilder.CreateCube("sphere", {}, this.renderer.scene)
        //this.sphere = LIB.MeshBuilder.CreateIcoSphere("sphere", {}, this.renderer.scene)
        this.cube = LIB.MeshBuilder.CreateCube("cube", {}, this.renderer2.scene)
        // super.render()
    }
}


class GardenAbstract extends ManualSetup {
    /*
     Using the supplied internal library generate two independent scenes.
     */
    start(){
        this.sphere = new Sphere({});
        let cube = new Cube({ renderer: this.renderer2 });
        cube.addToScene()
        this.cube = cube
    }
}

class GardenDoubleBasic extends Garden {
    /*
        Using the base architecture, render to two independent scenes
        To render two thin setups with a light:

            app = new GardenCoreBasic
            app.start()

        And poof. You're a 3D graphic designer.
     */
    config(){
        let renderers = {
            first: {
                element: 'renderCanvas'
                , size: [800, 600]
                , sceneColor: 'lightBlue'
            }

            , other: {
                element: 'otherCanvas'
                , size: [500, 400]
                , sceneColor: 'darkSlateBlue'
            }
        }

        return {
            apps: renderers
        }
    }

    start(){
        /* The main hook function to start your application. Fundamentally it's the
            first function. It's named by convension and has no relevence to the framework.

            By applying the initial configuration through the `config()` and constructor, at this
            point the interface is ready to run:

                var app = new GardeCoreBasic()

            The next step is using your app; you can simply reference the renderer `scene` and `engine`:

                var app = new GardeCoreBasic()
                let ball = new Sphere()
                ball.addToScene(app.$r.other.scene)

            But it's nice to have a start point:

                class MyApp extends Garden {
                    load(){
                        let cube = new Cube
                        this.children.add(cube)
                    }
                }

                app = new MyApp()
                app.load()
         */

        // `$r` is a shortcut to the names of `this.$renderers`
        let scenes = [this.$r.first.scene, this.$r.other.scene]

        // Add an item to each scene.
        //this.sphere = LIB.MeshBuilder.CreateSphere("sphere", {}, scenes[0]);
        //this.cube = LIB.MeshBuilder.CreateCube("cube", {}, scenes[1]);

        this.addLights(scenes)
    }

    addLights(scenes) {
        /* A loop to add a lightbulb on every instance.
        Each is stored as `this.light0`, `light1`... */

        let pos = new LIB.Vector3(1, 1, 0) // x,y,z
        for (var i = scenes.length - 1; i >= 0; i--) {
            let light = new LIB.HemisphericLight("light", pos, scenes[i]);
            this[`light${i}`] = light
        }
    }
}


class GardenSingleBasic extends Garden {
    /*
        Using the base architecture, render to two independent scenes
        To render two thin setups with a light:

            app = new GardenCoreBasic
            app.start()

        And poof. You're a 3D graphic designer.
     */
    config(){
        return {
            element: 'renderCanvas'
            //, name: 'dave'
            , size: [800, 600]
            , sceneColor: 'lightBlue'
        }
    }

    start(){
        // `$r` is a shortcut to the names of `this.$renderers`
        //let scene = this.$r.main.scene
        let scene = this.getRenderer().scene
        let pos = new LIB.Vector3(1, 1, 0)
        // Add an item to each scene.
        this.sphere = LIB.MeshBuilder.CreateSphere("sphere", {}, scene)
        //this.light = new LIB.HemisphericLight("light", pos, scene)
    }
}


class RendererConfig {
    /*
        You can configure an application using an 'app' object or a set of 'apps'.
        If the 'app' or 'apps' does not exist, the same parameters are retrieved
        from the root config.

        Here is an example of the same application configured using the
        4 different setups within a config().
     */

    config(){
        /* All options required for an app may exist on the root config
        object. the "element" is mandatory. */
        return {
            element: 'renderCanvas'
            , name: 'dave'
            , size: [800, 600]
            , sceneColor: 'lightBlue'
        }
    }

    config(){
        /* For a neater config you can define you "app" for all options targeting
        the core framework. Again "element" is mandatory*/
        return {
            app: {
                element: 'renderCanvas'
                , name: 'dave'
                , size: [800, 600]
                , sceneColor: 'lightBlue'
            }
        }
    }

    config(){
        /* For a list of apps you can provide an array of "apps" with each object
        a distinct "element" etc...
        The "name" parameter for an app allows easier manipulation later.*/
        return {
            apps: [
                {

                    element: 'renderCanvas'
                    , name: 'dave'
                    , size: [800, 600]
                    , sceneColor: 'lightBlue'
                }
            ]
        }
    }

    config(){
        /* Provide an "apps" object with each (key value) a single app.
        When using an option, the instansiated app has the "name" of `key`;
        Unlike the list "apps" method, the name attribute may exist, but can
        fallback to this definition.*/
        return {
            apps: {
                dave: {
                    element: 'renderCanvas'
                    // , name: 'dave'
                    , size: [800, 600]
                    , sceneColor: 'lightBlue'
                }
            }
        }
    }

}
