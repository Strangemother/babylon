class SimpleScene extends BaseClass {
    init(){
        /* Auto class is quick instansiated */
    }


    spotLight(app, d){
        if(d == undefined) d= {}

        let o = {
            position: asVector(0, -10, 0)
            , direction: asVector(0, 1, 0)
            , diffuse: 'white'
            , angle: 4
            , exponent: 12
            , intensity: 1
        }

        let c= this._mergeObjects(o, d)
        let light = new SpotLight(c)
    }
    ground()
}

