

class Tree extends GameSceneObject {

    static functionCaller() {
        return ['tree', Tree.generate]
    }

    static generate(scene, name, config) {

        if(scene == undefined) {
            console.error('static generate requires scene')
        }

        var t = new Tree(name, scene);
        var mesh = t.generate(scene, config);
        if(config == undefined) {
            config = {};
        }
        mesh.position = config.position || new BABYLON.Vector3(config.x || 0, config.y || 0, config.z || 0);

        return t;
    }

    get position(){
        return this._babylon.position;
    }

    set position(v){
        this._babylon.position = v;
        return true;
    }

    generate(scene, {sizeTrunk=6, sizeBranch=7, radius=2} = {}){
        var tree = this.treeObject(scene);
        var leaves = this.leavesObject(scene, sizeBranch);
        var trunk = this.trunkObject(scene, sizeTrunk, sizeBranch, radius);

        leaves.position.y = sizeTrunk+sizeBranch/2-2;

        leaves.parent = tree;
        trunk.parent = tree;
        this._babylon = tree;
        return tree;
    }

    treeObject(scene){
        var tree = new BABYLON.Mesh("tree", scene);
        tree.isVisible = false;
        return tree;
    }

    leavesObject(scene, sizeBranch){
        var leaves = new BABYLON.Mesh("leaves", scene);

        var vertexData = BABYLON.VertexData.CreateSphere({segments:2, diameter:sizeBranch}); //this line for BABYLONJS2.3 or later
        vertexData.applyToMesh(leaves, false);

        leaves.convertToFlatShadedMesh();
        leaves.material = materials.green(scene);

        distort(leaves, sizeBranch)
        return leaves;
    }

    trunkObject(scene, sizeTrunk, sizeBranch, radius){
        var trunk = BABYLON.Mesh.CreateCylinder("trunk", sizeTrunk, radius-2<1?1:radius-2, radius, 5, 2, scene );

        trunk.position.y = (sizeBranch/2+2)-sizeTrunk/2;

        trunk.material = materials.brown(scene);
        trunk.convertToFlatShadedMesh();

        return trunk;
    }
}

Objects.add(Tree)
