var colors = {};
let _colors = {
    red: [1, 0, 0]
    , green: [0, 1, 0]
    , blue: [0, 0, 1] // will be skipped due to override
    , blue: [0, 0, 1] // will be skipped due to override
}
// --

colors.white = function() {
    return colors.make(1, 1, 1);
}

colors.blue = function() {
    return colors.make(0, 0, 1);
}

colors.color3 = function(num) {
    return colors.make(num, num, num)
}

colors.color4 = function(num, a) {
    return colors.make(num, num, num, a || num)
}

colors.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16)
        , parseInt(result[2], 16)
        , parseInt(result[3], 16)
    ] : null;
}

colors.hex = function(hexVal){
    /* Create a color using a hex value*/
    return colors.make.apply(colors, colors.hexToRgb(hexVal).map(x => x/255))
}

colors.make = function(r, g, b, a) {
    if(r instanceof Array && g == undefined && b == undefined) {
        var v = r;
        r = v[0];
        g = v[1];
        b = v[2];
        a = v[3] || 1;
    };

    if(arguments.length == 3){
        return new BABYLON.Color3(r,g,b);
    };

    return new BABYLON.Color4(r,g,b,a);
}


colors.addColors = function(_colors, overwrite=true) {
    /* Add an object of colors,
    Creating a function on `colors` of the key from the given object.
    The function calls `colors.make` returning a BABYLON type.

        colors.addColors({ red: [1, 0, 0]})*/
    for(var name in _colors) {
        if(_colors[name] !== undefined && overwrite == true) {
            console.warn('overwrite ' + name)
        } else {
            return;
        }

        _colors[`_${name}`] = _colors[name];

        colors[name] = (function(){
            var name = this.name;
            var _colors = this._colors
            return function(){
                let c = colors.make(_colors[`_${name}`])
                return c;
            }

        }).apply({ name, _colors })
    }
}

colors.addColors(_colors, false)
