class ProceduralFloor extends Garden {
    init(config){
        config = config || {};
        config.backgroundColor = config.backgroundColor || [.2, .2, .4]
        super.init(config)
    }

    start(){
        this._path = this.path()
        this._light = new HemisphericLight();

        this.children.addMany(this._light);

        this._camera = new ArcRotateCamera({
            beta: 1.2
            , radius: 12
            , alpha: -3.105
            , activate:true
        });
        // this._camera.activate()
    }

    path(){
        /* render many panels in a direction as a _path_ */
        let panels = [];
        let panel;
        for(let i=0; i < 100; i++) {
            panel = this.panel(i);
            panel.addToScene()
            panels.push(panel)
        };

        return panels
    }

    panel(p){
        let width = 3
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
}


Garden.register(ProceduralFloor)
