
var position = {};

position.vector2 = function(x, y) {
    if(x instanceof Array && y === undefined){
        return new BABYLON.Vector2(x[0], x[1]);
    };

    return new BABYLON.Vector2(x, y);
}

class Position extends CoreClass {
    /* Live inspection of the game engine to determine
    the correct position for element relative from top left (0,0). */
    init(gameInterface){
        this.gameInterface = gameInterface;
    }

    get top() {
        /* Return the position for TOP of the interfact.
        This will not be 0.*/
    }
}
