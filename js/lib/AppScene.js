/*scene.js

Load a basic scene to play with.*/

class AppScene {

    settings(){
        return {
            cameraDistance: 40 // camera radius
            , cameraRotation: 1
        }
    }

    constructor(canvasName) {
        this.canvasName = canvasName;
        this._set = this.settings()
    }

    sceneColor(){
        return (new BABYLON.Color3(0, 1, 0))
    }

    scene(name){
        var _canvas = this._canvas = this.canvas(name);
        var _engine = this._engine = this.engine(_canvas);

        // Now create a basic Babylon Scene object
        var scene = new BABYLON.Scene(_engine);

        // Change the scene background color to green.
        scene.clearColor = this.sceneColor();
        return scene
    }

    canvas(name){
        name = name || this.canvasName;
        // Get the canvas element from our HTML below
        var canvas = document.querySelector(name);
        return canvas;
    }

    engine(canvas){
        // Load the BABYLON 3D engine
        var engine = new BABYLON.Engine(canvas, true);

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
           engine.resize();
        });

        return engine;
    }

    run(){
        this._scene = this.scene();
        this._camera = this.camera(this._scene, this._canvas);
        this.runLoop(this._engine, this._scene)
    }

    runLoop(engine, scene) {
        engine = engine || this._engine;
        this.init(engine, scene)
        engine.runRenderLoop(function() {
           scene.render();
        });
    }

    init(engine, scene){
        console.log('init Scene');
    }

    camera(scene, canvas){
        scene = scene || this._scene;
        canvas = canvas || this._canvas;

        // This creates and positions a free camera
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        var camera = new BABYLON.ArcRotateCamera("camera1", this._set.cameraRotation, Math.PI / 4, this._set.cameraDistance , new BABYLON.Vector3(2, 6,-10), scene);
        //var camera = new BABYLON.GamepadCamera("Camera", new BABYLON.Vector3(0, 15, -45), scene);
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, false);
        return camera;
    }
}


class BasicScene extends AppScene {

    sceneColor(){
        return (new BABYLON.Color3(.1,.1,.1))
    }

    init(engine, scene){
        // This creates a light, aiming 0,1,0 - to the sky.
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // Dim the light a small amount
        // light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1;
        this.object(scene)
    }

    object(scene, name) {
        // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
        var ground = this.ground(scene);
    }

    ground(scene){
        // Let's try our built-in 'ground' shape. Params: name, width, depth, subdivisions, scene
        var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        return ground;
    }
}


class EnvScene extends BasicScene {
    sceneColor(){
        return (new BABYLON.Color3(.96,.96,.96))
    }

    scene(name) {
        var scene = super.scene(name);
            // Fog
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        scene.fogDensity = 0.004;
        scene.fogColor = new BABYLON.Color3(0.8,0.83,0.8);

        return scene;
    }

    ground(scene) {
        // Ground
        var ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
        var whiteMaterial = new BABYLON.StandardMaterial("White", scene);
        whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.materal = whiteMaterial;
        return ground;
    }

    object(scene, name){
        var ground = this.ground(scene);
        // this._box = this.box(scene);
        return this._box;
    }

    box(scene, name){
        var box = BABYLON.Mesh.CreateBox(name || "box1", 2, scene);
        var material = new BABYLON.StandardMaterial("White", scene);
        material.diffuseColor = new BABYLON.Color3(.7,.7,.7);
        box.enableEdgesRendering();
        box.material = material
        box.edgesWidth = 4.0;
        box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
        box.position.y = 1.03
        //box.scale.y = .5
        box.convertToFlatShadedMesh();

        return box;

    }

    renderMatrix(mat, width) {
        var create
            , scene = this._scene
            , res = []
            ;

        if( typeof(mat) == 'number') {
            width = width === undefined? mat: width;
            mat = Array( Math.pow(2, mat) )
        }

        for (var i = 0; i < mat.length; i++) {
            create = true;//Boolean(mat[i]);
            var box
            if(create) {
                box = this.box(scene, `box${i}`);
                res.push(box);
                box.position.x = i * 5;
            }
        }

        return res;
    }

    lenseEffect(scene, camera){
        var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
            edge_blur: 2.0,
            chromatic_aberration: 1.0,
            distortion: 1.2,
            dof_focus_distance: 17,
            dof_aperture: 2.0,          // set this very high for tilt-shift effect
            grain_amount: 1.0,
            dof_pentagon: false,
            dof_gain: 1,
            dof_threshold:  -1,
            dof_darken: -1,
        }, scene, 1.6, camera);

        lensEffect._highlightsGain = .5;

        return lensEffect;
    }

    move(boxes, width, margin) {
        var create
            , scene = this._scene
            , margin = margin  == undefined? 2.05: margin
            ;

        width = width == undefined? Math.floor(Math.sqrt(boxes.length)): width

        for (var i = 0; i < boxes.length; i++) {
            create = mat[i] === undefined? Boolean(Math.random()<.6): Boolean(mat[i]);
            var box
                box = boxes[i]
                box.position.x = Math.floor(i / width) * margin;
                box.position.z = Math.floor(i % width) * margin;
            box.setEnabled(create)
        }
    }
}


class Actor {

    camera(scene, target){
        var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
        camera.target = target; // target any mesh or object with a "position" Vector3
        camera.radius = 11; // how far from the object to follow
        camera.heightOffset = 6; // how high above the object to place the camera
        camera.rotationOffset = 70; // the viewing angle
        camera.cameraAcceleration = 0.1 // how fast to move
        camera.maxCameraSpeed = 20 // speed limit
        return camera;
    }

    character(scene){
        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 5, 1.9, scene);
        sphere.position.y = 3.3
        var whiteMaterial = new BABYLON.StandardMaterial("Red", scene);
        whiteMaterial.diffuseColor = new BABYLON.Color3(1, 0,0);
        sphere.materal = whiteMaterial;

        // var light0 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 20, -10), new BABYLON.Vector3(0, -2, 3), 0.8, 2, scene);
        // light0.diffuse = new BABYLON.Color3(1, 1, 1);
        // light0.specular = new BABYLON.Color3(1, 1, 1);

        return sphere;
    }

    atMatrix(c, x, z) {
        var width = 16
            , margin = 2.05
        c.position.x = x * margin;
        c.position.z = z * margin;
    }
}

var mat = [
      1, 1, 0, 1
    , 1, 0, 1, 1
    , 1, 0, 1, 1
    , 1, 1, 0, 0
]

var runExample = function(){

    // var appScene = new BasicScene('#renderCanvas');
    var appScene = new EnvScene('#renderCanvas');
    appScene.run()

    var width = undefined
    var boxPow = 8
    var boxes = appScene.renderMatrix(boxPow, width);
    appScene.move(boxes, width);
    var scene = appScene._scene;
    actor = new Actor();
    c = actor.character(scene);
    c.rotation.y = 2.9;
    var camera = actor.camera(scene, c);
    scene.activeCamera = camera;
    // lens = appScene.lenseEffect(scene, scene.activeCamera)
    actor.atMatrix(c, 4, 5);
    canvas = appScene._canvas
    drawAxisFor = boxes;


}
