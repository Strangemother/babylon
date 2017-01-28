
class ShapeColumn extends Garden {
    start(){
        this._light = new HemisphericLight();
        this._camera = new ArcRotateCamera({activate:true});
        this.children.add(this._light);

        let t = new app.shapes.TriangleLines({ color: 'green' });
        let meshes = this.meshes = []

        let n = -Math.floor(colors.names.length/2), m;
        for(let c of colors.names) {
            m = t.create({
                color: c
                , position: [0, n++, 0]
                , rotation: [0, (n++)*.01, 0]
            })
            meshes.push(m)
        }
    }

    _destroyable(){
        return [
            this._camera
            , this._light
            , this.meshes
        ]
    }
}


Garden.register(ShapeColumn)
