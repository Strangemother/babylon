class Animation extends BabylonObject {

    init(...args) {
        let v = super.init(...args)
        this.keyFrames = [];
        return v;
    }

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.cameras */
        return 'animates'
    }

    babylonSceneArg(scene){
        return false
    }

    keys(){
        return [
            'targetProperty'
            , 'framePerSecond'
            , 'dataType'
            , 'loopMode'
            , 'enableBlending'
        ]
    }

    targetPropertyKey(){
        return 'rotation.x'
    }

    framePerSecondKey(){
        return 60
    }

    dataTypeKey(){
        /*

            BABYLON.Animation.ANIMATIONTYPE_FLOAT
            BABYLON.Animation.ANIMATIONTYPE_VECTOR2
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3
            BABYLON.Animation.ANIMATIONTYPE_QUATERNION
            BABYLON.Animation.ANIMATIONTYPE_MATRIX
            BABYLON.Animation.ANIMATIONTYPE_COLOR3

         */
        return BABYLON.Animation.ANIMATIONTYPE_FLOAT
    }

    loopModeKey(){
        /*
            BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE:
                Use previous values and increment it
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE:
                Restart from initial value
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT:
                Keep their final value
         */
        return BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    }

    enableBlendingKey(){
        return undefined;
    }

    frame(frame, value, frames=undefined){
        /* Push a frame into the list of internal keys */
        if(frames == undefined) {
            frames = this.keyFrames
        }

        let f = this.asFrame(frame, value)
        frames.push(f);
        return this;
    }

    frames(...args) {
        /* Get and set the internal keys*/

        if(args.length == 0) {
            return this.keyFrames;
        }

        let frames = args;
        if(arguments.length == 1 ){
            frames = [this.asFrame(args[1])];
            return this
        }

        let fs = frames.map(x => this.asFrame(x));

        this.keyFrames = fs
        return this;
    }

    asFrame(frame, value) {
        if(IT.g(frame).is('array')) {
            value = frame[1];
            frame = frame[0];
        };

        return { frame: frame, value: value};
    }

    propKeys(){
        return [
            'setKeys'
        ]
    }

    setKeysProp() {

        return this.frames()
    }

    setKeysPropSetter(mesh, prop, ...args) {
        mesh[prop](this.setKeysProp())
    }

    addToMesh(mesh, config) {
        /* Apply this item to the mesh.animation list */
        let bAnim = mesh.animations.push(this.create(config))
        return bAnim;
    }

    addToScene(scene, mesh, config) {
        let bAnim = this.addToMesh(mesh);
        let bAnimation = this._app.animate(mesh, this)

    }

}

Garden.register(Animation)
