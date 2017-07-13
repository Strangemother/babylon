class Object2D {
    /* implement the base level of world scene abstracton.
    All items and singletons should inherit from here. */

    constructor(config){
        this.config = config || {};
    }

    canvas(id){
        /* provide and create, or return a canvas instance. */
        if(id == undefined) {
            return this._canvas
        }

        return this._canvas = document.getElementById(id);

    }

    screenSpace(id){
        if(id == undefined) {
            this._screenSpace
        };

        let scene = this.scene()
        return (new BABYLON.ScreenSpaceCanvas2D(scene, { id: id }))
    }

    engine(canvas){

        if(canvas == undefined && this._engine != undefined) {
            return this._engine;
        };

        if(canvas == undefined) {
            canvas = this.canvas()
        }
        // Load the BABYLON 3D engine
        var engine = new BABYLON.Engine(canvas, true);

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
           engine.resize();
        });

        this._engine = engine
        return this._engine;
    }

    scene(engine){
        if(this._scene) return this._scene;

        if(engine == undefined) {
            engine = this.engine()
        };

        return this._scene = new BABYLON.Scene(engine);
    }

    getBabylonSet(app){

        if(Garden != undefined) {
            let i = Garden.instance();
            if(i != undefined) {
                return i.babylonSet;
            }
        };

        this.create()
        return [this._scene, this._engine, this._canvas]
    }

}


class Scene2D extends Object2D {

    /*
    A basic scene can hold an instance of the ScreenSpaceCanvas2D
    or generate new with Scene2D.create() */
    create(canvasName='renderCanvas'){
         let [scene, engine, canvas] = this.getBabylonSet()
        return [scene, engine, canvas]
    }

    screenSpace(scene, canvasName='renderCanvas'){
        if(scene == undefined) {
            scene = this.create(canvasName)[0];
        };

        return new BABYLON.ScreenSpaceCanvas2D(scene,
            {
                id: canvasName
                // , size: new BABYLON.Size(600, 600)
                , cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE
                , backgroundFill: BABYLON.Canvas2D.GetSolidColorBrushFromHex("#80808040")
                , backgroundRoundRadius: 10
                , backgroundBorder: BABYLON.Canvas2D.GetSolidColorBrushFromHex("#FFFFFFFF")
                , backgroundBorderThickNess: 2
            }
        );
    }

    start(){
        let canvas = this.screenSpace();
        return canvas;
    }

    loop(){
        let _items = [];
        let canvas = this.start()
        let items = function(){
            return this.items(canvas);
        }.bind(this);

        this.x = 0
        this.rotation = 0
        this.renderTimer = setInterval(function(){
            if(canvas.isDisposed) {
                clearInterval(this.renderTimer);
                return;
            }
            for (var i = _items.length - 1; i >= 0; i--) {
                _items[i].dispose();
            }

            _items=items()
        }, 10)

        return this
    }

    items(canvas){
        this.rotation -= .01

        var rect = new BABYLON.Rectangle2D({
            parent: canvas
            , id: "Rect"
            , x: (app._canvas.width / 2) - 100
            , y: (app._canvas.height / 2) - 200
            , width: 200
            , height: 100
            , border: BABYLON.Canvas2D.GetSolidColorBrushFromHex("#AAAAAAFF")
            , fill: BABYLON.Canvas2D.GetGradientColorBrush(
                new BABYLON.Color4(0.1, 0.2, 0.4, .6)
                , new BABYLON.Color4(0, 0, 0, .05)
                )
            , borderThickness: 3
            , roundRadius: 5 });

        var text = new BABYLON.Text2D("Simple 2D text.",
            {
                parent: canvas
                , marginAlignment: "h:center, v:center"
                , fontName: "12pt Arial"
                , rotation: this.rotation
                , defaultFontColor: new BABYLON.Color4(1, 1, 1, 1)
                //, x: this.x
            });

        return [rect, text]
    }
}
