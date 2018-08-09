(function (LIB) {
    /**
     * Node is the basic class for all scene objects (Mesh, Light Camera).
     */
    var Node = /** @class */ (function () {
        /**
         * @constructor
         * @param {string} name - the name and id to be given to this node
         * @param {LIB.Scene} the scene this node will be added to
         */
        function Node(name, scene) {
            if (scene === void 0) { scene = null; }
            this.state = "";
            this.metadata = null;
            this.doNotSerialize = false;
            this.animations = new Array();
            this._ranges = {};
            this._isEnabled = true;
            this._isReady = true;
            this._currentRenderId = -1;
            this._parentRenderId = -1;
            /**
            * An event triggered when the mesh is disposed.
            * @type {LIB.Observable}
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
        Object.defineProperty(Node.prototype, "parent", {
            get: function () {
                return this._parentNode;
            },
            set: function (parent) {
                if (this._parentNode === parent) {
                    return;
                }
                if (this._parentNode) {
                    var index = this._parentNode._children.indexOf(this);
                    if (index !== -1) {
                        this._parentNode._children.splice(index, 1);
                    }
                }
                this._parentNode = parent;
                if (this._parentNode) {
                    if (!this._parentNode._children) {
                        this._parentNode._children = new Array();
                    }
                    this._parentNode._children.push(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Node.prototype.getClassName = function () {
            return "Node";
        };
        Object.defineProperty(Node.prototype, "onDispose", {
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Node.prototype.getScene = function () {
            return this._scene;
        };
        Node.prototype.getEngine = function () {
            return this._scene.getEngine();
        };
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
            get: function () {
                return this._behaviors;
            },
            enumerable: true,
            configurable: true
        });
        Node.prototype.getBehaviorByName = function (name) {
            for (var _i = 0, _a = this._behaviors; _i < _a.length; _i++) {
                var behavior = _a[_i];
                if (behavior.name === name) {
                    return behavior;
                }
            }
            return null;
        };
        // override it in derived class
        Node.prototype.getWorldMatrix = function () {
            return LIB.Matrix.Identity();
        };
        // override it in derived class if you add new variables to the cache
        // and call the parent class method
        Node.prototype._initCache = function () {
            this._cache = {};
            this._cache.parent = undefined;
        };
        Node.prototype.updateCache = function (force) {
            if (!force && this.isSynchronized())
                return;
            this._cache.parent = this.parent;
            this._updateCache();
        };
        // override it in derived class if you add new variables to the cache
        // and call the parent class method if !ignoreParentClass
        Node.prototype._updateCache = function (ignoreParentClass) {
        };
        // override it in derived class if you add new variables to the cache
        Node.prototype._isSynchronized = function () {
            return true;
        };
        Node.prototype._markSyncedWithParent = function () {
            if (this.parent) {
                this._parentRenderId = this.parent._currentRenderId;
            }
        };
        Node.prototype.isSynchronizedWithParent = function () {
            if (!this.parent) {
                return true;
            }
            if (this._parentRenderId !== this.parent._currentRenderId) {
                return false;
            }
            return this.parent.isSynchronized();
        };
        Node.prototype.isSynchronized = function (updateCache) {
            var check = this.hasNewParent();
            check = check || !this.isSynchronizedWithParent();
            check = check || !this._isSynchronized();
            if (updateCache)
                this.updateCache(true);
            return !check;
        };
        Node.prototype.hasNewParent = function (update) {
            if (this._cache.parent === this.parent)
                return false;
            if (update)
                this._cache.parent = this.parent;
            return true;
        };
        /**
         * Is this node ready to be used/rendered
         * @return {boolean} is it ready
         */
        Node.prototype.isReady = function () {
            return this._isReady;
        };
        /**
         * Is this node enabled.
         * If the node has a parent and is enabled, the parent will be inspected as well.
         * @return {boolean} whether this node (and its parent) is enabled.
         * @see setEnabled
         */
        Node.prototype.isEnabled = function () {
            if (!this._isEnabled) {
                return false;
            }
            if (this.parent) {
                return this.parent.isEnabled();
            }
            return true;
        };
        /**
         * Set the enabled state of this node.
         * @param {boolean} value - the new enabled state
         * @see isEnabled
         */
        Node.prototype.setEnabled = function (value) {
            this._isEnabled = value;
        };
        /**
         * Is this node a descendant of the given node.
         * The function will iterate up the hierarchy until the ancestor was found or no more parents defined.
         * @param {LIB.Node} ancestor - The parent node to inspect
         * @see parent
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
        /**
         * Evaluate the list of children and determine if they should be considered as descendants considering the given criterias
         * @param {LIB.Node[]} results the result array containing the nodes matching the given criterias
         * @param {boolean} directDescendantsOnly if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered.
         * @param predicate: an optional predicate that will be called on every evaluated children, the predicate must return true for a given child to be part of the result, otherwise it will be ignored.
         */
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
         * Will return all nodes that have this node as ascendant.
         * @param {boolean} directDescendantsOnly if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered.
         * @param predicate: an optional predicate that will be called on every evaluated children, the predicate must return true for a given child to be part of the result, otherwise it will be ignored.
         * @return {LIB.Node[]} all children nodes of all types.
         */
        Node.prototype.getDescendants = function (directDescendantsOnly, predicate) {
            var results = new Array();
            this._getDescendants(results, directDescendantsOnly, predicate);
            return results;
        };
        /**
         * Get all child-meshes of this node.
         */
        Node.prototype.getChildMeshes = function (directDescendantsOnly, predicate) {
            var results = [];
            this._getDescendants(results, directDescendantsOnly, function (node) {
                return ((!predicate || predicate(node)) && (node instanceof LIB.AbstractMesh));
            });
            return results;
        };
        /**
         * Get all child-transformNodes of this node.
         */
        Node.prototype.getChildTransformNodes = function (directDescendantsOnly, predicate) {
            var results = [];
            this._getDescendants(results, directDescendantsOnly, function (node) {
                return ((!predicate || predicate(node)) && (node instanceof LIB.TransformNode));
            });
            return results;
        };
        /**
         * Get all direct children of this node.
        */
        Node.prototype.getChildren = function (predicate) {
            return this.getDescendants(true, predicate);
        };
        Node.prototype._setReady = function (state) {
            if (state === this._isReady) {
                return;
            }
            if (!state) {
                this._isReady = false;
                return;
            }
            this._isReady = true;
            if (this.onReady) {
                this.onReady(this);
            }
        };
        Node.prototype.getAnimationByName = function (name) {
            for (var i = 0; i < this.animations.length; i++) {
                var animation = this.animations[i];
                if (animation.name === name) {
                    return animation;
                }
            }
            return null;
        };
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
        Node.prototype.deleteAnimationRange = function (name, deleteFrames) {
            if (deleteFrames === void 0) { deleteFrames = true; }
            for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                if (this.animations[i]) {
                    this.animations[i].deleteRange(name, deleteFrames);
                }
            }
            this._ranges[name] = null; // said much faster than 'delete this._range[name]'
        };
        Node.prototype.getAnimationRange = function (name) {
            return this._ranges[name];
        };
        Node.prototype.beginAnimation = function (name, loop, speedRatio, onAnimationEnd) {
            var range = this.getAnimationRange(name);
            if (!range) {
                return;
            }
            this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
        };
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
        // override it in derived class
        Node.prototype.computeWorldMatrix = function (force) {
            return LIB.Matrix.Identity();
        };
        Node.prototype.dispose = function () {
            this.parent = null;
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
            // Behaviors
            for (var _i = 0, _a = this._behaviors; _i < _a.length; _i++) {
                var behavior = _a[_i];
                behavior.detach();
            }
            this._behaviors = [];
        };
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
