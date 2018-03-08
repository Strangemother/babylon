class Simple2dExample extends Garden {

    start(){
        this.scene2D = (new Scene2D).loop()
    }
}


Garden.register(Simple2dExample)
