

var LIB;
(function (LIB) {
    /**
     * Node is the basic class for all scene objects (Mesh, Light Camera).
     */
    var Node = /** @class */ (function () {
        /**
         * Creates a new Node
         * @param {string} name - the name and id to be given to this node
         * @param {LIB.Scene} the scene this node will be added to
         */
        function Node(name, scene) {
            if (scene === void 0) { scene = null; }
            /**
             * Gets or sets a string used to store user defined state for the node
             */
            this.state = "";
            /**
             * Gets or sets an object used to store user defined information for the node
             */
            this.metadata = null;
            /**
             * Gets or sets a boolean used to define if the node must be serialized
             */
            this.doNotSerialize = false;
            /** @hidden */
            this._isDisposed = false;
            /**
             * Gets a list of Animations associated with the node
             */
            this.animations = new Array();
            this._ranges = {};
            this._isEnabled = true;
            this._isReady = true;
            /** @hidden */
            this._currentRenderId = -1;
            this._parentRenderId = -1;
            this._childRenderId = -1;
            this._animationPropertiesOverride = null;
            /**
            * An event triggered when the mesh is disposed
            */
            this.onDisposeObservable = new LIB.Observable();
            // Behaviors
            this._behaviors = new Array();
            this.name = name;
            this.id = name;
            this._scene = (scene || LIB.Engine.LastCreatedScene);
            this.uniqueId = this._scene.getUniqueId();
            this._initCache();
        }
        /**
         * Gets a boolean indicating if the node has been disposed
         * @returns true if the node was disposed
         */
        Node.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        Object.defineProperty(Node.prototype, "parent", {
            get: function () {
                return this._parentNode;
            },
            /**
             * Gets or sets the parent of the node
             */
            set: function (parent) {
                if (this._parentNode === parent) {
                    return;
                }
                // Remove self from list of children of parent
                if (this._parentNode && this._parentNode._children !== undefined && this._parentNode._children !== null) {
                    var index = this._parentNode._children.indexOf(this);
                    if (index !== -1) {
                        this._parentNode._children.splice(index, 1);
                    }
                }
                // Store new parent
                this._parentNode = parent;
                // Add as child to new parent
                if (this._parentNode) {
                    if (this._parentNode._children === undefined || this._parentNode._children === null) {
                        this._parentNode._children = new Array();
                    }
                    this._parentNode._children.push(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "animationPropertiesOverride", {
            /**
             * Gets or sets the animation properties override
             */
            get: function () {
                if (!this._animationPropertiesOverride) {
                    return this._scene.animationPropertiesOverride;
                }
                return this._animationPropertiesOverride;
            },
            set: function (value) {
                this._animationPropertiesOverride = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets a string idenfifying the name of the class
         * @returns "Node" string
         */
        Node.prototype.getClassName = function () {
            return "Node";
        };
        Object.defineProperty(Node.prototype, "onDispose", {
            /**
             * Sets a callback that will be raised when the node will be disposed
             */
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the scene of the node
         * @returns a {LIB.Scene}
         */
        Node.prototype.getScene = function () {
            return this._scene;
        };
        /**
         * Gets the engine of the node
         * @returns a {LIB.Engine}
         */
        Node.prototype.getEngine = function () {
            return this._scene.getEngine();
        };
        /**
         * Attach a behavior to the node
         * @see http://doc.LIBjs.com/features/behaviour
         * @param behavior defines the behavior to attach
         * @returns the current Node
         */
        Node.prototype.addBehavior = function (behavior) {
            var _this = this;
            var index = this._behaviors.indexOf(behavior);
            if (index !== -1) {
                return this;
            }
            behavior.init();
            if (this._scene.isLoading) {
                // We defer the attach when the scene will be loaded
                var observer = this._scene.onDataLoadedObservable.add(function () {
                    behavior.attach(_this);
                    setTimeout(function () {
                        // Need to use a timeout to avoid removing an observer while iterating the list of observers
                        _this._scene.onDataLoadedObservable.remove(observer);
                    }, 0);
                });
            }
            else {
                behavior.attach(this);
            }
            this._behaviors.push(behavior);
            return this;
        };
        /**
         * Remove an attached behavior
         * @see http://doc.LIBjs.com/features/behaviour
         * @param behavior defines the behavior to attach
         * @returns the current Node
         */
        Node.prototype.removeBehavior = function (behavior) {
            var index = this._behaviors.indexOf(behavior);
            if (index === -1) {
                return this;
            }
            this._behaviors[index].detach();
            this._behaviors.splice(index, 1);
            return this;
        };
        Object.defineProperty(Node.prototype, "behaviors", {
            /**
             * Gets the list of attached behaviors
             * @see http://doc.LIBjs.com/features/behaviour
             */
            get: function () {
                return this._behaviors;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets an attached behavior by name
         * @param name defines the name of the behavior to look for
         * @see http://doc.LIBjs.com/features/behaviour
         * @returns null if behavior was not found else the requested behavior
         */
        Node.prototype.getBehaviorByName = function (name) {
            for (var _i = 0, _a = this._behaviors; _i < _a.length; _i++) {
                var behavior = _a[_i];
                if (behavior.name === name) {
                    return behavior;
                }
            }
            return null;
        };
        /**
         * Returns the world matrix of the node
         * @returns a matrix containing the node's world matrix
         */
        Node.prototype.getWorldMatrix = function () {
            return LIB.Matrix.Identity();
        };
        /** @hidden */
        Node.prototype._getWorldMatrixDeterminant = function () {
            return 1;
        };
        // override it in derived class if you add new variables to the cache
        // and call the parent class method
        /** @hidden */
        Node.prototype._initCache = function () {
            this._cache = {};
            this._cache.parent = undefined;
        };
        /** @hidden */
        Node.prototype.updateCache = function (force) {
            if (!force && this.isSynchronized())
                return;
            this._cache.parent = this.parent;
            this._updateCache();
        };
        // override it in derived class if you add new variables to the cache
        // and call the parent class method if !ignoreParentClass
        /** @hidden */
        Node.prototype._updateCache = function (ignoreParentClass) {
        };
        // override it in derived class if you add new variables to the cache
        /** @hidden */
        Node.prototype._isSynchronized = function () {
            return true;
        };
        /** @hidden */
        Node.prototype._markSyncedWithParent = function () {
            if (this.parent) {
                this._parentRenderId = this.parent._childRenderId;
            }
        };
        /** @hidden */
        Node.prototype.isSynchronizedWithParent = function () {
            if (!this.parent) {
                return true;
            }
            if (this._parentRenderId !== this.parent._childRenderId) {
                return false;
            }
            return this.parent.isSynchronized();
        };
        /** @hidden */
        Node.prototype.isSynchronized = function (updateCache) {
            var check = this.hasNewParent();
            check = check || !this.isSynchronizedWithParent();
            check = check || !this._isSynchronized();
            if (updateCache)
                this.updateCache(true);
            return !check;
        };
        /** @hidden */
        Node.prototype.hasNewParent = function (update) {
            if (this._cache.parent === this.parent)
                return false;
            if (update)
                this._cache.parent = this.parent;
            return true;
        };
        /**
         * Is this node ready to be used/rendered
         * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
         * @return true if the node is ready
         */
        Node.prototype.isReady = function (completeCheck) {
            if (completeCheck === void 0) { completeCheck = false; }
            return this._isReady;
        };
        /**
         * Is this node enabled?
         * If the node has a parent, all ancestors will be checked and false will be returned if any are false (not enabled), otherwise will return true
         * @param checkAncestors indicates if this method should check the ancestors. The default is to check the ancestors. If set to false, the method will return the value of this node without checking ancestors
         * @return whether this node (and its parent) is enabled
         */
        Node.prototype.isEnabled = function (checkAncestors) {
            if (checkAncestors === void 0) { checkAncestors = true; }
            if (checkAncestors === false) {
                return this._isEnabled;
            }
            if (this._isEnabled === false) {
                return false;
            }
            if (this.parent !== undefined && this.parent !== null) {
                return this.parent.isEnabled(checkAncestors);
            }
            return true;
        };
        /**
         * Set the enabled state of this node
         * @param value defines the new enabled state
         */
        Node.prototype.setEnabled = function (value) {
            this._isEnabled = value;
        };
        /**
         * Is this node a descendant of the given node?
         * The function will iterate up the hierarchy until the ancestor was found or no more parents defined
         * @param ancestor defines the parent node to inspect
         * @returns a boolean indicating if this node is a descendant of the given node
         */
        Node.prototype.isDescendantOf = function (ancestor) {
            if (this.parent) {
                if (this.parent === ancestor) {
                    return true;
                }
                return this.parent.isDescendantOf(ancestor);
            }
            return false;
        };
        /** @hidden */
        Node.prototype._getDescendants = function (results, directDescendantsOnly, predicate) {
            if (directDescendantsOnly === void 0) { directDescendantsOnly = false; }
            if (!this._children) {
                return;
            }
            for (var index = 0; index < this._children.length; index++) {
                var item = this._children[index];
                if (!predicate || predicate(item)) {
                    results.push(item);
                }
                if (!directDescendantsOnly) {
                    item._getDescendants(results, false, predicate);
                }
            }
        };
        /**
         * Will return all nodes that have this node as ascendant
         * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
         * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
         * @return all children nodes of all types
         */
        Node.prototype.getDescendants = function (directDescendantsOnly, predicate) {
            var results = new Array();
            this._getDescendants(results, directDescendantsOnly, predicate);
            return results;
        };
        /**
         * Get all child-meshes of this node
         * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
         * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
         * @returns an array of {LIB.AbstractMesh}
         */
        Node.prototype.getChildMeshes = function (directDescendantsOnly, predicate) {
            var results = [];
            this._getDescendants(results, directDescendantsOnly, function (node) {
                return ((!predicate || predicate(node)) && (node instanceof LIB.AbstractMesh));
            });
            return results;
        };
        /**
         * Get all child-transformNodes of this node
         * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
         * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
         * @returns an array of {LIB.TransformNode}
         */
        Node.prototype.getChildTransformNodes = function (directDescendantsOnly, predicate) {
            var results = [];
            this._getDescendants(results, directDescendantsOnly, function (node) {
                return ((!predicate || predicate(node)) && (node instanceof LIB.TransformNode));
            });
            return results;
        };
        /**
         * Get all direct children of this node
         * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
         * @returns an array of {LIB.Node}
         */
        Node.prototype.getChildren = function (predicate) {
            return this.getDescendants(true, predicate);
        };
        /** @hidden */
        Node.prototype._setReady = function (state) {
            if (state === this._isReady) {
                return;
            }
            if (!state) {
                this._isReady = false;
                return;
            }
            if (this.onReady) {
                this.onReady(this);
            }
            this._isReady = true;
        };
        /**
         * Get an animation by name
         * @param name defines the name of the animation to look for
         * @returns null if not found else the requested animation
         */
        Node.prototype.getAnimationByName = function (name) {
            for (var i = 0; i < this.animations.length; i++) {
                var animation = this.animations[i];
                if (animation.name === name) {
                    return animation;
                }
            }
            return null;
        };
        /**
         * Creates an animation range for this node
         * @param name defines the name of the range
         * @param from defines the starting key
         * @param to defines the end key
         */
        Node.prototype.createAnimationRange = function (name, from, to) {
            // check name not already in use
            if (!this._ranges[name]) {
                this._ranges[name] = new LIB.AnimationRange(name, from, to);
                for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                    if (this.animations[i]) {
                        this.animations[i].createRange(name, from, to);
                    }
                }
            }
        };
        /**
         * Delete a specific animation range
         * @param name defines the name of the range to delete
         * @param deleteFrames defines if animation frames from the range must be deleted as well
         */
        Node.prototype.deleteAnimationRange = function (name, deleteFrames) {
            if (deleteFrames === void 0) { deleteFrames = true; }
            for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                if (this.animations[i]) {
                    this.animations[i].deleteRange(name, deleteFrames);
                }
            }
            this._ranges[name] = null; // said much faster than 'delete this._range[name]' 
        };
        /**
         * Get an animation range by name
         * @param name defines the name of the animation range to look for
         * @returns null if not found else the requested animation range
         */
        Node.prototype.getAnimationRange = function (name) {
            return this._ranges[name];
        };
        /**
         * Will start the animation sequence
         * @param name defines the range frames for animation sequence
         * @param loop defines if the animation should loop (false by default)
         * @param speedRatio defines the speed factor in which to run the animation (1 by default)
         * @param onAnimationEnd defines a function to be executed when the animation ended (undefined by default)
         * @returns the object created for this animation. If range does not exist, it will return null
         */
        Node.prototype.beginAnimation = function (name, loop, speedRatio, onAnimationEnd) {
            var range = this.getAnimationRange(name);
            if (!range) {
                return null;
            }
            return this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
        };
        /**
         * Serialize animation ranges into a JSON compatible object
         * @returns serialization object
         */
        Node.prototype.serializeAnimationRanges = function () {
            var serializationRanges = [];
            for (var name in this._ranges) {
                var localRange = this._ranges[name];
                if (!localRange) {
                    continue;
                }
                var range = {};
                range.name = name;
                range.from = localRange.from;
                range.to = localRange.to;
                serializationRanges.push(range);
            }
            return serializationRanges;
        };
        /**
         * Computes the world matrix of the node
         * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
         * @returns the world matrix
         */
        Node.prototype.computeWorldMatrix = function (force) {
            return LIB.Matrix.Identity();
        };
        /**
         * Releases resources associated with this node.
         * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
         * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
         */
        Node.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
            if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
            if (!doNotRecurse) {
                var nodes = this.getDescendants(true);
                for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                    var node = nodes_1[_i];
                    node.dispose(doNotRecurse, disposeMaterialAndTextures);
                }
            }
            else {
                var transformNodes = this.getChildTransformNodes(true);
                for (var _a = 0, transformNodes_1 = transformNodes; _a < transformNodes_1.length; _a++) {
                    var transformNode = transformNodes_1[_a];
                    transformNode.parent = null;
                    transformNode.computeWorldMatrix(true);
                }
            }
            this.parent = null;
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
            // Behaviors
            for (var _b = 0, _c = this._behaviors; _b < _c.length; _b++) {
                var behavior = _c[_b];
                behavior.detach();
            }
            this._behaviors = [];
            this._isDisposed = true;
        };
        /**
         * Parse animation range data from a serialization object and store them into a given node
         * @param node defines where to store the animation ranges
         * @param parsedNode defines the serialization object to read data from
         * @param scene defines the hosting scene
         */
        Node.ParseAnimationRanges = function (node, parsedNode, scene) {
            if (parsedNode.ranges) {
                for (var index = 0; index < parsedNode.ranges.length; index++) {
                    var data = parsedNode.ranges[index];
                    node.createAnimationRange(data.name, data.from, data.to);
                }
            }
        };
        __decorate([
            LIB.serialize()
        ], Node.prototype, "name", void 0);
        __decorate([
            LIB.serialize()
        ], Node.prototype, "id", void 0);
        __decorate([
            LIB.serialize()
        ], Node.prototype, "uniqueId", void 0);
        __decorate([
            LIB.serialize()
        ], Node.prototype, "state", void 0);
        __decorate([
            LIB.serialize()
        ], Node.prototype, "metadata", void 0);
        return Node;
    }());
    LIB.Node = Node;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.node.js.map
//# sourceMappingURL=LIB.node.js.map
