(function (LIB) {
    var Debug;
    (function (Debug) {
        var PhysicsViewer = /** @class */ (function () {
            function PhysicsViewer(scene) {
                this._impostors = [];
                this._meshes = [];
                this._numMeshes = 0;
                this._scene = scene || LIB.Engine.LastCreatedScene;
                var physicEngine = this._scene.getPhysicsEngine();
                if (physicEngine) {
                    this._physicsEnginePlugin = physicEngine.getPhysicsPlugin();
                }
            }
            PhysicsViewer.prototype._updateDebugMeshes = function () {
                var plugin = this._physicsEnginePlugin;
                for (var i = 0; i < this._numMeshes; i++) {
                    var impostor = this._impostors[i];
                    if (!impostor) {
                        continue;
                    }
                    if (impostor.isDisposed) {
                        this.hideImpostor(this._impostors[i--]);
                    }
                    else {
                        var mesh = this._meshes[i];
                        if (mesh && plugin) {
                            plugin.syncMeshWithImpostor(mesh, impostor);
                        }
                    }
                }
            };
            PhysicsViewer.prototype.showImpostor = function (impostor) {
                if (!this._scene) {
                    return;
                }
                for (var i = 0; i < this._numMeshes; i++) {
                    if (this._impostors[i] == impostor) {
                        return;
                    }
                }
                var debugMesh = this._getDebugMesh(impostor, this._scene);
                if (debugMesh) {
                    this._impostors[this._numMeshes] = impostor;
                    this._meshes[this._numMeshes] = debugMesh;
                    if (this._numMeshes === 0) {
                        this._renderFunction = this._updateDebugMeshes.bind(this);
                        this._scene.registerBeforeRender(this._renderFunction);
                    }
                    this._numMeshes++;
                }
            };
            PhysicsViewer.prototype.hideImpostor = function (impostor) {
                if (!impostor || !this._scene) {
                    return;
                }
                var removed = false;
                for (var i = 0; i < this._numMeshes; i++) {
                    if (this._impostors[i] == impostor) {
                        var mesh = this._meshes[i];
                        if (!mesh) {
                            continue;
                        }
                        this._scene.removeMesh(mesh);
                        mesh.dispose();
                        this._numMeshes--;
                        if (this._numMeshes > 0) {
                            this._meshes[i] = this._meshes[this._numMeshes];
                            this._impostors[i] = this._impostors[this._numMeshes];
                            this._meshes[this._numMeshes] = null;
                            this._impostors[this._numMeshes] = null;
                        }
                        else {
                            this._meshes[0] = null;
                            this._impostors[0] = null;
                        }
                        removed = true;
                        break;
                    }
                }
                if (removed && this._numMeshes === 0) {
                    this._scene.unregisterBeforeRender(this._renderFunction);
                }
            };
            PhysicsViewer.prototype._getDebugMaterial = function (scene) {
                if (!this._debugMaterial) {
                    this._debugMaterial = new LIB.StandardMaterial('', scene);
                    this._debugMaterial.wireframe = true;
                }
                return this._debugMaterial;
            };
            PhysicsViewer.prototype._getDebugBoxMesh = function (scene) {
                if (!this._debugBoxMesh) {
                    this._debugBoxMesh = LIB.MeshBuilder.CreateBox('physicsBodyBoxViewMesh', { size: 1 }, scene);
                    this._debugBoxMesh.renderingGroupId = 1;
                    this._debugBoxMesh.rotationQuaternion = LIB.Quaternion.Identity();
                    this._debugBoxMesh.material = this._getDebugMaterial(scene);
                    scene.removeMesh(this._debugBoxMesh);
                }
                return this._debugBoxMesh.createInstance('physicsBodyBoxViewInstance');
            };
            PhysicsViewer.prototype._getDebugSphereMesh = function (scene) {
                if (!this._debugSphereMesh) {
                    this._debugSphereMesh = LIB.MeshBuilder.CreateSphere('physicsBodySphereViewMesh', { diameter: 1 }, scene);
                    this._debugSphereMesh.renderingGroupId = 1;
                    this._debugSphereMesh.rotationQuaternion = LIB.Quaternion.Identity();
                    this._debugSphereMesh.material = this._getDebugMaterial(scene);
                    scene.removeMesh(this._debugSphereMesh);
                }
                return this._debugSphereMesh.createInstance('physicsBodyBoxViewInstance');
            };
            PhysicsViewer.prototype._getDebugMesh = function (impostor, scene) {
                var mesh = null;
                if (impostor.type == LIB.PhysicsImpostor.BoxImpostor) {
                    mesh = this._getDebugBoxMesh(scene);
                    impostor.getBoxSizeToRef(mesh.scaling);
                }
                else if (impostor.type == LIB.PhysicsImpostor.SphereImpostor) {
                    mesh = this._getDebugSphereMesh(scene);
                    var radius = impostor.getRadius();
                    mesh.scaling.x = radius * 2;
                    mesh.scaling.y = radius * 2;
                    mesh.scaling.z = radius * 2;
                }
                return mesh;
            };
            PhysicsViewer.prototype.dispose = function () {
                for (var i = 0; i < this._numMeshes; i++) {
                    this.hideImpostor(this._impostors[i]);
                }
                if (this._debugBoxMesh) {
                    this._debugBoxMesh.dispose();
                }
                if (this._debugSphereMesh) {
                    this._debugSphereMesh.dispose();
                }
                if (this._debugMaterial) {
                    this._debugMaterial.dispose();
                }
                this._impostors.length = 0;
                this._scene = null;
                this._physicsEnginePlugin = null;
            };
            return PhysicsViewer;
        }());
        Debug.PhysicsViewer = PhysicsViewer;
    })(Debug = LIB.Debug || (LIB.Debug = {}));
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.physicsViewer.js.map
