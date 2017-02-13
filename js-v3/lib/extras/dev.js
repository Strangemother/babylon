class Developer extends BaseClass {

    init(...args){
        console.info('Init Developer')
        super.init(...args)

        this.setup(...args)
    }

    setup(app) {
        let scene = app.scene()
        this._clicker = new SceneClickHighlight()
        // this._clicker.doubleClicked = this.doubleClicked.bind(this)
        this._clicker.on()
    }

    doubleClicked(item, e) {
        if(!item.hit) return;
        let id = item.pickedMesh.id;
        let gInst = Garden.instance().children.getItem(id);
        gInst.wireframe = !gInst.wireframe;
    }
}


var sceneClickers = {
    setScene: false
    , onPointerUp: funcChain([])
    , onPointerDown: funcChain([])
    , _onPointerUp(ev, m){
        this.onPointerUp(ev, m)
    }
    , _onPointerDown(ev, m){
        this.onPointerDown(ev, m)
    }
}


class SceneClick {

    constructor(click, down, up, scene) {
        if(click) {
            this.on.apply(this, arguments)
        };
    }

    on(click, down, up, scene) {
        if(this._on) return true;
        scene = scene || Garden.instance().scene()

        this._click = click != undefined ? click: this._click;
        this._down = down;
        this._up = up;

        if(this._click == undefined){
            this._click == this.__click;
        }

        this._createClickerChain(scene, 'onPointerUp', 'onPointerDown')

        this.__up = this.up.bind(this)
        this.__down = this.down.bind(this)

        sceneClickers.onPointerUp.add(this.__up)
        sceneClickers.onPointerDown.add(this.__down)
        this._on = true;
    }

    off(scene){
        if(!this._on) return true;
        this.__click = this._click;
        sceneClickers.onPointerUp.remove(this.__up)
        sceneClickers.onPointerDown.remove(this.__down)
        this._on = false;
    }

    add(f) {
        sceneClickers.onPointerUp.add(f)
    }

    remove(f) {
        sceneClickers.onPointerUp.remove(f)
    }

    _createClickerChain(scene, ...names){
        scene = scene || Garden.instance().scene()

        if(!sceneClickers.setScene) {
            for(let name of names) {
                if(scene[name] != sceneClickers['_' + name]) {
                    let f = scene[name];
                    if(f) {
                        sceneClickers[name].add(f);
                    }

                    scene[name] = sceneClickers['_' + name].bind(sceneClickers)
                }
            }
            sceneClickers.setScene = true
        }
    }

    down(e, item){
        if(!item.hit) return;

        let id = item.pickedMesh.id;
        this._lastID = id
        let c = true;

        this.lastX = e.clientX
        this.lastY = e.clientY

        if(this._down) c = this._down(item, e, id)
        if(c === false) {
            this._lastID = undefined;
        }
    }

    up(e, item){
        if(!item.pickedMesh) return;


        let id = item.pickedMesh.id;
        let c = true;

        if(this._up) c = this._up(item, e, id)

        if(c === false) return;

        if(this._lastID == id
            && this.lastX == e.clientX
            && this.lastY == e.clientY
            ) {
            this.clicked(item, e)
        }
    }



    delta(){
        return 200;
    }

    clicked(item ,e){
       //  super.clicked.apply(this, arguments)
        let now = Date.now();
        let _d = now - this.last;

        if(this._click) {
            this._click(item, e, _d)
        }

        if(_d < this.delta()) {
            this.doubleClicked(item, e, _d)
        }

        this.last = now
    }

    doubleClicked(item, e, delta){

        if(this._doubleClick) {
            return this._doubleClick(item, e)
        }

        console.log('SceneClick double click', delta)
    }

}

class SceneClickHighlight extends SceneClick {

    on(scene) {
        super.on(scene)

        if(!this.axis) {
            this.axis = new Axis()
            this.axisM = this.axis.addToScene()
            this.axisM.visibility = 0
        }
    }

    off(scene) {
        if(this.lastClicked) {
            this.lastClicked.renderoutline = false;
        }
        super.off(scene)
    }

    _click(item, e) {

        if(!item.hit) return;
        let id = item.pickedMesh.id;
        let gInst = Garden.instance().children.getItem(id);

        if(this.lastClicked == gInst && gInst.renderoutline == true) {
            gInst.renderoutline = false
            this.axisM.visibility = 0
            this.lastClicked = undefined;
            developer.selected = undefined
            return
        }

        if(this.lastClicked) {
            this.lastClicked.renderoutline = !this.lastClicked.renderoutline
        }

        if(gInst != this.lastClicked) {
            gInst.renderoutline = !gInst.renderoutline
        };

        this.lastClicked = gInst;
        developer.selected = this.lastClicked;
        this.axisM.visibility = gInst.renderoutline == true
        this.axisM.parent = gInst._babylon


    }


}
