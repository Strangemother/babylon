class ConveyerCubes extends Garden {
    init(config){
        config = config || {};
        config.backgroundColor = config.backgroundColor || [0.3,.3,.3]
        super.init(config)

    }

    start(){
        this.walker = new WalkerInterface(this)
        this.walker.start()
        window.we = this.walker;
        this._ready = true
        this.renderLoop = this.renderLoop_ofStart
    }

    renderLoop_ofStart() {
        this.walker.step()
        return super.renderLoop.apply(this, arguments)
    }
}

class Walker {

    constructor(app){
        this.app = app;
        this.count = 50;
        this.width = 3
    }

    makePath(){
        /* render many panels in a direction as a _path_ */
        let panels = [];
        let panel;
        for(let i=0; i < this.count; i++) {
            panel = this.panel(i);
            panel.addToScene()
            panels.push(panel)
        };

        return panels
    }

    panel(p){
        let width = this.width;
        /* returns a simple panel */
        let b = new Box({
            color: 'white',
            height: .1,
            width: width,
            depth: width,
            position: [p * ( width + .1 ), 1, 0]
        });
        return b
    }

    basicScene(){
        let app = this.app;
        this.light = new HemisphericLight();
        app.children.addMany(this.light);

        this.camera = new ArcRotateCamera({
            beta: 1.2
            , radius: 32
            , alpha: -3.105
            , activate:true
        });

        this.axis = new ColorAxisArrow({size: 1})
        this.axis.addToScene()
    }

    step(){
        /* step the scene.*/
        let v = this.count * (this.width + .1)
        for (var i = 0; i < this.path.length; i++) {
            let b = this.path[i]._babylon;
            b.position.x -= .05

            if(b.position.x < -v/2) {
                b.position.x += v
            }
        }
    }
}

class WalkerInterface extends Walker {

    start(){
        this.basicScene()
        this.path = this.makePath()
    }

}

Garden.register(ConveyerCubes, WalkerInterface)
