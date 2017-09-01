class SkyBoxExample extends Garden {
    start(){
        this.baseScene()
        this.box = new Box({ color: 'white' })
        let mesh = this.mesh = this.box.addToScene()
    }

    baseScene(){
        this.skyBox = new SkyBox({assetName: 'mountains'});
        this.skyBoxMesh = this.skyBox.addToScene();

        this.camera = new app.cameras.ArcRotateCamera(true)
    }
}


Garden.register(SkyBoxExample)
