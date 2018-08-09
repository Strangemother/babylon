
class ProcLitScene extends GardenPatch {
    $start(){

        this.camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19

        });

        this.light = new HemisphericLight({ color: 'white'});

        this.ground = new Ground({
            width: 20
            , height: 20
            , subdivisions: 1
        })

        this.$children.addMany(this.light, this.ground);
        this.camera.activate();
    }
}

class ProcLitBox extends GardenPatch {
    $start(){

        this.light = new PointLight({
            position: [0, 3, 0]
            , intensity: .5
        })

        this.box = new Box({ color: 'green', position:[0, 1, 0] });
        this.$children.addMany(this.box, this.light);

    }
}

class ProcPlay extends Garden {
    /* Mix a scene and an element using two patches.
    Each ran from the start function */
    $patches(){
        return [ProcLitScene, ProcLitBox]
    }

    start(){

        this.sphere = new Sphere({
            diameter: 2
            , subdivisions: 16
            , position: [0, 5, 0]
            , color: 'lightBlue'
        })
        this.children.add(this.sphere)
        this.parts()
    }

    parts(){

        let item = this.s = new Box({
            diameter: 1
            , segments: 1
            , color: 'green' // colors.emissive('white')
        })

        this.ps = new ParticleSystem({
            count: 100
            , items: [item]
            , updatable: true
            //, setParticles: true
        })

        this.spp = new MatrixParticlePositions;
        this.ps.addUpdator(this.spp)
        this.spsMesh = this.ps.addToScene()
    }
}

Garden.register(ProcPlay)

BABYLON.Mesh.prototype.increaseFacets = function(pps) { //pps points per side
    var _gaps = pps+1;
    var _n = _gaps + 1;
    var _fvs =[];
    for(var _i=0; _i<_n; _i++) {
        _fvs[_i] = [];
    }
    var _A,_B;
    var _d ={x:0,y:0,z:0};
    var _u ={x:0,y:0};
    var _indices = [];
    var _vertexIndex = [];
    var _side = [];
    var _l; //holds lengths
    var _uvs = this.getVerticesData(BABYLON.VertexBuffer.UVKind);
    var _meshIndices = this.getIndices();
    var _positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var _normals =[];

    for(var _i = 0; _i<_meshIndices.length; _i+=3) {
        _vertexIndex[0] = _meshIndices[_i];
        _vertexIndex[1] = _meshIndices[_i + 1];
        _vertexIndex[2] = _meshIndices[_i + 2];
        for(var _j = 0; _j<3; _j++) {
            _A = _vertexIndex[_j];
            _B = _vertexIndex[(_j+1)%3];
            if(_side[_A] === undefined  && _side[_B] ===  undefined) {
                _side[_A] = [];
                _side[_B] = [];
            }
            else {
                if(_side[_A] === undefined) {
                    _side[_A] = [];
                }
                if(_side[_B] === undefined) {
                    _side[_B] = [];
                }
            }
            if(_side[_A][_B]  === undefined  && _side[_B][_A] === undefined) {
                _side[_A][_B] = [];
                _d.x = (_positions[3 * _B] - _positions[3 * _A])/_gaps;
                _d.y = (_positions[3 * _B + 1] - _positions[3 * _A + 1])/_gaps;
                _d.z = (_positions[3 * _B + 2] - _positions[3 * _A + 2])/_gaps;
                _u.x = (_uvs[2*_B] - _uvs[2*_A])/_gaps;
                _u.y = (_uvs[2*_B + 1] - _uvs[2*_A + 1])/_gaps;
                _side[_A][_B].push(_A);
                for(var _k=1; _k<_gaps; _k++) {
                    _side[_A][_B].push(_positions.length/3);
                    _positions.push(_positions[3 * _A] + _k*_d.x, _positions[3 * _A + 1] + _k*_d.y, _positions[3 * _A + 2] + _k*_d.z);
                    _uvs.push(_uvs[2*_A] + _k*_u.x, _uvs[2*_A + 1] + _k*_u.y);
                }
                _side[_A][_B].push(_B);
                _side[_B][_A]=[];
                _l = _side[_A][_B].length;
                for(var _a=0; _a<_l; _a++) {
                    _side[_B][_A][_a] = _side[_A][_B][_l-1-_a];
                }
            }
            else {
                if(_side[_A][_B] === undefined) {
                    _side[_A][_B]=[];
                    _l = _side[_B][_A].length;
                    for(var _a=0; _a<_l; _a++) {
                        _side[_A][_B][_a] = _side[_B][_A][_l-1-_a];
                    }
                }
                if(_side[_B][_A] === undefined) {
                    _side[_B][_A]=[];
                    _l = _side[_A][_B].length;
                    for(var _a=0; _a<_l; _a++) {
                        _side[_B][_A][_a] = _side[_A][_B][_l-1-_a];
                    }
                }
            }
        }
        _fvs[0][0] = _meshIndices[_i];
        _fvs[1][0] = _side[_meshIndices[_i]][_meshIndices[_i + 1]][1];
        _fvs[1][1] = _side[_meshIndices[_i]][_meshIndices[_i + 2]][1];
        for(var _k = 2; _k<_gaps; _k++) {
            _fvs[_k][0] = _side[_meshIndices[_i]][_meshIndices[_i + 1]][_k];
            _fvs[_k][_k] = _side[_meshIndices[_i]][_meshIndices[_i + 2]][_k];
            _d.x = (_positions[3 * _fvs[_k][_k]] - _positions[3 * _fvs[_k][0]])/_k;
            _d.y = (_positions[3 * _fvs[_k][_k] + 1] - _positions[3 * _fvs[_k][0] + 1])/_k;
            _d.z = (_positions[3 * _fvs[_k][_k] + 2] - _positions[3 * _fvs[_k][0] + 2])/_k;
            _u.x = (_uvs[2*_fvs[_k][_k]] - _uvs[2*_fvs[_k][0]])/_k;
            _u.y = (_uvs[2*_fvs[_k][_k] + 1] - _uvs[2*_fvs[_k][0] + 1])/_k;
            for(var _j = 1; _j<_k; _j++) {
                _fvs[_k][_j] = _positions.length/3;
                _positions.push(_positions[3 * _fvs[_k][0]] + _j*_d.x, _positions[3 * _fvs[_k][0] + 1] + _j*_d.y, _positions[3 * _fvs[_k][0] + 2] + _j*_d.z);
                _uvs.push(_uvs[2*_fvs[_k][0]] + _j*_u.x, _uvs[2*_fvs[_k][0] + 1] + _j*_u.y);
            }
        }
        _fvs[_gaps] = _side[_meshIndices[_i + 1]][_meshIndices[_i + 2]];

        _indices.push(_fvs[0][0],_fvs[1][0],_fvs[1][1]);
        for(var _k = 1; _k<_gaps; _k++) {
            for(var _j = 0; _j<_k; _j++) {
                _indices.push(_fvs[_k][_j],_fvs[_k+1][_j],_fvs[_k+1][_j+1]);
                _indices.push(_fvs[_k][_j],_fvs[_k+1][_j+1],_fvs[_k][_j+1]);
            }
            _indices.push(_fvs[_k][_j],_fvs[_k+1][_j],_fvs[_k+1][_j+1]);
        }

    }

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = _positions;
    vertexData.indices = _indices;
    vertexData.uvs = _uvs;

    BABYLON.VertexData.ComputeNormals(_positions, _indices, _normals);
    vertexData.normals = _normals;

    vertexData.applyToMesh(this);

}
