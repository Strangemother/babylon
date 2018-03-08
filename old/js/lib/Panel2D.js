class Panel2D extends CoreClass {

    init(scene, name) {

        if(name == undefined && scene.scene !== undefined){
            name = scene.name;
            scene = scene.scene;
        } else {
            this.data = {
                name: name
                , scene: scene
            }

        }

        var size = this.data.size || this.size();
        var p = this.data.position || this.position();
        this.canvas = this.createCanvas(scene, name, p, size);

        this.create(this.canvas)
    }

    createCanvas(scene, name, p, size){

        var canvas = BABYLON.Canvas2D.CreateScreenSpace(
                scene
                , name
                , position.vector2(p)
                , new BABYLON.Size(size[0], size[1])
                , BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE
            );
        return canvas;
    }

    create(){}

    position(){
        return [0,0]
    }

    backgroundColor(){
        return "#11111180"
    }

    draw(canvas) {
        canvas = canvas || this.canvas;
        var bk = this.backgroundColor();
        canvas.backgroundFill = BABYLON.Canvas2D.GetSolidColorBrushFromHex(bk);
        canvas.backgroundRoundRadius = 0;
    }

    size() {
        return [200,100]
    }
}

class PadInputPanel extends Panel2D {

    draw(canvas) {
        canvas = canvas || this.canvas;
        var c =  GameInterface._instance._scene._canvas
    }

    size() {
        return [200,100]
    }

    position() {
        return [200,100]
    }


    createCanvas(scene, name, p, size){

        var canvas = BABYLON.Canvas2D.CreateScreenSpace(
                scene
                , name
                , position.vector2(p)
                , new BABYLON.Size(size[0], size[1])
                , BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE
            );
        return canvas;
    }

    create(canvas){

        var rect = new BABYLON.Rectangle2D({
            id: "mainRect"
            , parent: canvas
            , x: 200
            , y: 200
            , width: 100
            , height: 100
            , fill: "#404080FF"
            , border: "#A040A0D0, #FFFFFFFF"
            , borderThickness: 10
            , roundRadius: 10
            , children:[
                new BABYLON.Rectangle2D(
                {
                    id: "insideRect"
                    , marginAlignment: "v: center, h: center",
                    width: 40
                    , height: 40
                    , fill: "#FAFF75FF"
                    , roundRadius: 10
                })
            ]
        });
    }
}

class TextPanel2D extends Panel2D {

    text(){
        return this._text || this.data.text || "I'm a panel"
    }


    size(size){
        if(size !== undefined){
            this._size = size
        }

        if(this._size) {
            return this._size
        };

        size = measureText(this.text(), this.font())
        return size;
    }

    font(){
        return `${this.fontSize()}${this.fontMeasurment()} ${this.fontFamily()}`
    }

    fontFamily() {
        return 'Courier New'
    }

    fontSize(){
        return 1.3
    }

    fontMeasurment(){
        return 'em'
    }

    init(){
        super.init.apply(this, arguments);
        this._text = this.data.text || undefined;
    }

    draw(canvas) {
        canvas = canvas || this.canvas;
        super.draw(canvas);
        var text = BABYLON.Text2D.Create(
                canvas
                , "text"
                , this.size()[0] * .5
                , this.size()[1] * .5
                , this.font()
                , this.text()
                , colors.color4(0.9, 1.0)
            );
        this.textElement = text;
    }
}
