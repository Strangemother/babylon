
var LIB;
(function (LIB) {
    //WebWorker code will be inserted to this variable.
    LIB.CollisionWorker = "";
    /** Defines supported task for worker process */
    var WorkerTaskType;
    (function (WorkerTaskType) {
        /** Initialization */
        WorkerTaskType[WorkerTaskType["INIT"] = 0] = "INIT";
        /** Update of geometry */
        WorkerTaskType[WorkerTaskType["UPDATE"] = 1] = "UPDATE";
        /** Evaluate collision */
        WorkerTaskType[WorkerTaskType["COLLIDE"] = 2] = "COLLIDE";
    })(WorkerTaskType = LIB.WorkerTaskType || (LIB.WorkerTaskType = {}));
    /** Defines kind of replies returned by worker */
    var WorkerReplyType;
    (function (WorkerReplyType) {
        /** Success */
        WorkerReplyType[WorkerReplyType["SUCCESS"] = 0] = "SUCCESS";
        /** Unkown error */
        WorkerReplyType[WorkerReplyType["UNKNOWN_ERROR"] = 1] = "UNKNOWN_ERROR";
    })(WorkerReplyType = LIB.WorkerReplyType || (LIB.WorkerReplyType = {}));
    var CollisionCoordinatorWorker = /** @class */ (function () {
        function CollisionCoordinatorWorker() {
            var _this = this;
            this._scaledPosition = LIB.Vector3.Zero();
            this._scaledVelocity = LIB.Vector3.Zero();
            this.onMeshUpdated = function (transformNode) {
                _this._addUpdateMeshesList[transformNode.uniqueId] = CollisionCoordinatorWorker.SerializeMesh(transformNode);
            };
            this.onGeometryUpdated = function (geometry) {
                _this._addUpdateGeometriesList[geometry.id] = CollisionCoordinatorWorker.SerializeGeometry(geometry);
            };
            this._afterRender = function () {
                if (!_this._init)
                    return;
                if (_this._toRemoveGeometryArray.length == 0 && _this._toRemoveMeshesArray.length == 0 && Object.keys(_this._addUpdateGeometriesList).length == 0 && Object.keys(_this._addUpdateMeshesList).length == 0) {
                    return;
                }
                //5 concurrent updates were sent to the web worker and were not yet processed. Abort next update.
                //TODO make sure update runs as fast as possible to be able to update 60 FPS.
                if (_this._runningUpdated > 4) {
                    return;
                }
                ++_this._runningUpdated;
                var payload = {
                    updatedMeshes: _this._addUpdateMeshesList,
                    updatedGeometries: _this._addUpdateGeometriesList,
                    removedGeometries: _this._toRemoveGeometryArray,
                    removedMeshes: _this._toRemoveMeshesArray
                };
                var message = {
                    payload: payload,
                    taskType: WorkerTaskType.UPDATE
                };
                var serializable = [];
                for (var id in payload.updatedGeometries) {
                    if (payload.updatedGeometries.hasOwnProperty(id)) {
                        //prepare transferables
                        serializable.push(message.payload.updatedGeometries[id].indices.buffer);
                        serializable.push(message.payload.updatedGeometries[id].normals.buffer);
                        serializable.push(message.payload.updatedGeometries[id].positions.buffer);
                    }
                }
                _this._worker.postMessage(message, serializable);
                _this._addUpdateMeshesList = {};
                _this._addUpdateGeometriesList = {};
                _this._toRemoveGeometryArray = [];
                _this._toRemoveMeshesArray = [];
            };
            this._onMessageFromWorker = function (e) {
                var returnData = e.data;
                if (returnData.error != WorkerReplyType.SUCCESS) {
                    //TODO what errors can be returned from the worker?
                    LIB.Tools.Warn("error returned from worker!");
                    return;
                }
                switch (returnData.taskType) {
                    case WorkerTaskType.INIT:
                        _this._init = true;
                        //Update the worked with ALL of the scene's current state
                        _this._scene.meshes.forEach(function (mesh) {
                            _this.onMeshAdded(mesh);
                        });
                        _this._scene.getGeometries().forEach(function (geometry) {
                            _this.onGeometryAdded(geometry);
                        });
                        break;
                    case WorkerTaskType.UPDATE:
                        _this._runningUpdated--;
                        break;
                    case WorkerTaskType.COLLIDE:
                        var returnPayload = returnData.payload;
                        if (!_this._collisionsCallbackArray[returnPayload.collisionId])
                            return;
                        var callback = _this._collisionsCallbackArray[returnPayload.collisionId];
                        if (callback) {
                            var mesh = _this._scene.getMeshByUniqueID(returnPayload.collidedMeshUniqueId);
                            if (mesh) {
                                callback(returnPayload.collisionId, LIB.Vector3.FromArray(returnPayload.newPosition), mesh);
                            }
                        }
                        //cleanup
                        _this._collisionsCallbackArray[returnPayload.collisionId] = null;
                        break;
                }
            };
            this._collisionsCallbackArray = [];
            this._init = false;
            this._runningUpdated = 0;
            this._addUpdateMeshesList = {};
            this._addUpdateGeometriesList = {};
            this._toRemoveGeometryArray = [];
            this._toRemoveMeshesArray = [];
        }
        CollisionCoordinatorWorker.prototype.getNewPosition = function (position, displacement, collider, maximumRetry, excludedMesh, onNewPosition, collisionIndex) {
            if (!this._init)
                return;
            if (this._collisionsCallbackArray[collisionIndex] || this._collisionsCallbackArray[collisionIndex + 100000])
                return;
            position.divideToRef(collider._radius, this._scaledPosition);
            displacement.divideToRef(collider._radius, this._scaledVelocity);
            this._collisionsCallbackArray[collisionIndex] = onNewPosition;
            var payload = {
                collider: {
                    position: this._scaledPosition.asArray(),
                    velocity: this._scaledVelocity.asArray(),
                    radius: collider._radius.asArray()
                },
                collisionId: collisionIndex,
                excludedMeshUniqueId: excludedMesh ? excludedMesh.uniqueId : null,
                maximumRetry: maximumRetry
            };
            var message = {
                payload: payload,
                taskType: WorkerTaskType.COLLIDE
            };
            this._worker.postMessage(message);
        };
        CollisionCoordinatorWorker.prototype.init = function (scene) {
            this._scene = scene;
            this._scene.registerAfterRender(this._afterRender);
            var workerUrl = LIB.WorkerIncluded ? LIB.Engine.CodeRepository + "Collisions/LIB.collisionWorker.js" : URL.createObjectURL(new Blob([LIB.CollisionWorker], { type: 'application/javascript' }));
            this._worker = new Worker(workerUrl);
            this._worker.onmessage = this._onMessageFromWorker;
            var message = {
                payload: {},
                taskType: WorkerTaskType.INIT
            };
            this._worker.postMessage(message);
        };
        CollisionCoordinatorWorker.prototype.destroy = function () {
            this._scene.unregisterAfterRender(this._afterRender);
            this._worker.terminate();
        };
        CollisionCoordinatorWorker.prototype.onMeshAdded = function (mesh) {
            mesh.registerAfterWorldMatrixUpdate(this.onMeshUpdated);
            this.onMeshUpdated(mesh);
        };
        CollisionCoordinatorWorker.prototype.onMeshRemoved = function (mesh) {
            this._toRemoveMeshesArray.push(mesh.uniqueId);
        };
        CollisionCoordinatorWorker.prototype.onGeometryAdded = function (geometry) {
            //TODO this will break if the user uses his own function. This should be an array of callbacks!
            geometry.onGeometryUpdated = this.onGeometryUpdated;
            this.onGeometryUpdated(geometry);
        };
        CollisionCoordinatorWorker.prototype.onGeometryDeleted = function (geometry) {
            this._toRemoveGeometryArray.push(geometry.id);
        };
        CollisionCoordinatorWorker.SerializeMesh = function (mesh) {
            var submeshes = [];
            if (mesh.subMeshes) {
                submeshes = mesh.subMeshes.map(function (sm, idx) {
                    var boundingInfo = sm.getBoundingInfo();
                    return {
                        position: idx,
                        verticesStart: sm.verticesStart,
                        verticesCount: sm.verticesCount,
                        indexStart: sm.indexStart,
                        indexCount: sm.indexCount,
                        hasMaterial: !!sm.getMaterial(),
                        sphereCenter: boundingInfo.boundingSphere.centerWorld.asArray(),
                        sphereRadius: boundingInfo.boundingSphere.radiusWorld,
                        boxMinimum: boundingInfo.boundingBox.minimumWorld.asArray(),
                        boxMaximum: boundingInfo.boundingBox.maximumWorld.asArray()
                    };
                });
            }
            var geometryId = null;
            if (mesh instanceof LIB.Mesh) {
                var geometry = mesh.geometry;
                geometryId = geometry ? geometry.id : null;
            }
            else if (mesh instanceof LIB.InstancedMesh) {
                var geometry = mesh.sourceMesh && mesh.sourceMesh.geometry;
                geometryId = geometry ? geometry.id : null;
            }
            var boundingInfo = mesh.getBoundingInfo();
            return {
                uniqueId: mesh.uniqueId,
                id: mesh.id,
                name: mesh.name,
                geometryId: geometryId,
                sphereCenter: boundingInfo.boundingSphere.centerWorld.asArray(),
                sphereRadius: boundingInfo.boundingSphere.radiusWorld,
                boxMinimum: boundingInfo.boundingBox.minimumWorld.asArray(),
                boxMaximum: boundingInfo.boundingBox.maximumWorld.asArray(),
                worldMatrixFromCache: mesh.worldMatrixFromCache.asArray(),
                subMeshes: submeshes,
                checkCollisions: mesh.checkCollisions
            };
        };
        CollisionCoordinatorWorker.SerializeGeometry = function (geometry) {
            return {
                id: geometry.id,
                positions: new Float32Array(geometry.getVerticesData(LIB.VertexBuffer.PositionKind) || []),
                normals: new Float32Array(geometry.getVerticesData(LIB.VertexBuffer.NormalKind) || []),
                indices: new Uint32Array(geometry.getIndices() || []),
            };
        };
        return CollisionCoordinatorWorker;
    }());
    LIB.CollisionCoordinatorWorker = CollisionCoordinatorWorker;
    var CollisionCoordinatorLegacy = /** @class */ (function () {
        function CollisionCoordinatorLegacy() {
            this._scaledPosition = LIB.Vector3.Zero();
            this._scaledVelocity = LIB.Vector3.Zero();
            this._finalPosition = LIB.Vector3.Zero();
        }
        CollisionCoordinatorLegacy.prototype.getNewPosition = function (position, displacement, collider, maximumRetry, excludedMesh, onNewPosition, collisionIndex) {
            position.divideToRef(collider._radius, this._scaledPosition);
            displacement.divideToRef(collider._radius, this._scaledVelocity);
            collider.collidedMesh = null;
            collider._retry = 0;
            collider._initialVelocity = this._scaledVelocity;
            collider._initialPosition = this._scaledPosition;
            this._collideWithWorld(this._scaledPosition, this._scaledVelocity, collider, maximumRetry, this._finalPosition, excludedMesh);
            this._finalPosition.multiplyInPlace(collider._radius);
            //run the callback
            onNewPosition(collisionIndex, this._finalPosition, collider.collidedMesh);
        };
        CollisionCoordinatorLegacy.prototype.init = function (scene) {
            this._scene = scene;
        };
        CollisionCoordinatorLegacy.prototype.destroy = function () {
            //Legacy need no destruction method.
        };
        //No update in legacy mode
        CollisionCoordinatorLegacy.prototype.onMeshAdded = function (mesh) { };
        CollisionCoordinatorLegacy.prototype.onMeshUpdated = function (mesh) { };
        CollisionCoordinatorLegacy.prototype.onMeshRemoved = function (mesh) { };
        CollisionCoordinatorLegacy.prototype.onGeometryAdded = function (geometry) { };
        CollisionCoordinatorLegacy.prototype.onGeometryUpdated = function (geometry) { };
        CollisionCoordinatorLegacy.prototype.onGeometryDeleted = function (geometry) { };
        CollisionCoordinatorLegacy.prototype._collideWithWorld = function (position, velocity, collider, maximumRetry, finalPosition, excludedMesh) {
            if (excludedMesh === void 0) { excludedMesh = null; }
            var closeDistance = LIB.Engine.CollisionsEpsilon * 10.0;
            if (collider._retry >= maximumRetry) {
                finalPosition.copyFrom(position);
                return;
            }
            // Check if this is a mesh else camera or -1
            var collisionMask = (excludedMesh ? excludedMesh.collisionMask : collider.collisionMask);
            collider._initialize(position, velocity, closeDistance);
            // Check all meshes
            for (var index = 0; index < this._scene.meshes.length; index++) {
                var mesh = this._scene.meshes[index];
                if (mesh.isEnabled() && mesh.checkCollisions && mesh.subMeshes && mesh !== excludedMesh && ((collisionMask & mesh.collisionGroup) !== 0)) {
                    mesh._checkCollision(collider);
                }
            }
            if (!collider.collisionFound) {
                position.addToRef(velocity, finalPosition);
                return;
            }
            if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0) {
                collider._getResponse(position, velocity);
            }
            if (velocity.length() <= closeDistance) {
                finalPosition.copyFrom(position);
                return;
            }
            collider._retry++;
            this._collideWithWorld(position, velocity, collider, maximumRetry, finalPosition, excludedMesh);
        };
        return CollisionCoordinatorLegacy;
    }());
    LIB.CollisionCoordinatorLegacy = CollisionCoordinatorLegacy;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.collisionCoordinator.js.map
//# sourceMappingURL=LIB.collisionCoordinator.js.map
