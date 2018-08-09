class ApplicationBasic {
    /* User extendable application designed for clean implementation
    of a Garden rendering host.
    Utilize two canvases, storing each as an 'app'. Mount and create a default
    camera. Finally call render to punt the colours to the scene.

        g = new ApplicationBasic
        g.init()
        g.render()
    */

    init(){
        this.app = new StartFunctionRender('renderCanvas', {
            size: [800, 600]
            , sceneColor: 'lightBlue'
        })


        this.app2 = new StartFunctionRender('otherCanvas', {
            size: [500, 400]
            , sceneColor: 'darkSlateBlue'
        })


        this.app.mount()
        this.app2.mount()
        this.makeCamera(this.app)
        this.makeCamera(this.app2)
    }

    render(){
        /*
         An open 'render' function for your looping scene. A default render function
         will call the attached app.scene render() function and any hooked functions
         for update at FPS speed.

         Because this example has two apps; we override to render two scenes.
         */
        this.app.scene.render()
        this.app2.scene.render()
    }

    makeCamera(app){
        /*
         An application requires a camera from the first render. A Default 'freecamera'
         generates the basic camera. Override the default camera in the `makeCamera` function.
         Attaching a custom first camera to the scene.

         At any point a new camera can be created and attach to a scene - allowing for a
         multi-camera setup.
         */
        // Add a camera to the scene and attach it to the canvas
        var camera = new LIB.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, LIB.Vector3.Zero(), app.scene);
        camera.attachControl(app.canvas, true);
        app.camera = camera
    }
}

class BabylonApplicationBasic extends ApplicationBasic {
    /* Using the base architecture, render to two independent scenes

        g = new BabylonApplicationBasic
        g.init()
        g.start()

     */
    start(){
        this.sphere = LIB.MeshBuilder.CreateSphere("sphere", {}, this.app.scene);
        this.cube = LIB.MeshBuilder.CreateBox("cube", {}, this.app2.scene);
        // super.render()
    }
}


class GardenBasic extends ApplicationBasic {
    /*
     Using the supplied internal library generate two independent scenes.
     */
    start(){
        this.sphere = new Sphere({});

        let cube = new Cube({ app: this.app2 });
        cube.addToScene()
        this.cube = cube
    }
}


class GardenApplicationBasic extends Garden {
    /* User extendable application designed for clean implementation
    of a Garden rendering host.*/

    init(){
        this.app = new StartFunctionRender('renderCanvas', this, {
            size: [800, 600]
            , sceneColor: 'lightBlue'

        })


        this.app2 = new StartFunctionRender('otherCanvas', this, {
            size: [500, 400]
            , sceneColor: 'darkSlateBlue'

        })

        this.app.mount()
        this.app2.mount()

        this.makeCamera(this.app)
        this.makeCamera(this.app2)
    }

    config(){
        return {

            apps: {
                app: {
                    element: 'renderCanvas'
                    , size: [800, 600]
                    , sceneColor: 'lightBlue'
                }

                , app2: {
                    element: 'otherCanvas'
                    , size: [500, 400]
                    , sceneColor: 'darkSlateBlue'
                }
            }

        }
    }

    render(){
        this.app.scene.render()
        this.app2.scene.render()
    }

    makeCamera(app){
        // Add a camera to the scene and attach it to the canvas
        var camera = new LIB.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, LIB.Vector3.Zero(), app.scene);
        camera.attachControl(app.canvas, true);
        app.camera = camera
    }
}


class _GardenBasic extends GardenApplicationBasic {

    start(){
        this.sphere = new Sphere({});

        let cube = new Cube({ app: this.app2 });
        cube.addToScene()

        this.cube = cube

        super.render()
    }
}


class GardenBablyonBasic extends GardenApplicationBasic {
    /*
        Using the base architecture, render to two independent scenes
        To render two thin scenes with no lighting:

            app = new GardenBablyonBasic()
            app.start()

        And poof. You're a 3D graphic designer.
     */
    start(){
        this.sphere = LIB.MeshBuilder.CreateSphere("sphere", {}, this.app.scene);
        this.cube = LIB.MeshBuilder.CreateBox("cube", {}, this.app2.scene);
    }
}
