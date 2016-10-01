
var materials = {};
var colors = {};
var modifiers = {};

materials.white = function(scene) {
    var mat = materials.standard(scene, 'White')
    mat.diffuseColor = colors.white()
    return mat
}

materials.blue = function(scene) {
    var mat = materials.standard(scene, 'Blue')
    mat.emissiveColor = colors.blue()
    return mat
}

materials.standard = function(scene, name) {
    var m = new BABYLON.StandardMaterial(name, scene);
    return m;
}

modifiers.fog = function(scene) {
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.04;
    scene.fogColor = new BABYLON.Color3(0.8, 0.83, 0.8);
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

colors.addColors = function(_colors) {

    for(var name in _colors) {
        if(_colors[name] !== undefined) {
            console.warn('overwrite ' + name)
        };

        _colors[`_${name}`] = _colors[name];
        console.log('making color', name);

        colors[name] = (function(){
            var name = this.name;
            var _colors = this._colors
            return function(){
                c = colors.make(_colors[`_${name}`])
                return c;
            }

        }).apply({ name, _colors })

        materials[name] = (function(){
            var _name = this.name;
            return function colorCaller(scene, n){
                n = n || _name;
                var mat = materials.standard(scene, n);
                mat.diffuseColor = colors[n]();
                return mat;
            }

        }).apply({ name })
    }
}
