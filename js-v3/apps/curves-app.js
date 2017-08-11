
class CurveExample extends Garden {

    start(){

        this._camera = new ArcRotateCamera({
            radius: 200
            , activate: true
        });

        let axis = new ColorAxisArrow({size:20});

        let curve = new CubicBezierLine({color: 'yellow'})
        curve.addToScene()

        let curve2 = new QuadraticBezierLine({
                points: [
                    new BABYLON.Vector3(5,5,5)
                    , new BABYLON.Vector3(50, 30, 10)
                    , new BABYLON.Vector3(20, 50, 0)
                ]
                , pointCount: 25
                , color: 'red'
            })
        curve2.addToScene()

        axis.addTo(curve)
    }


}


Garden.register(CurveExample);
