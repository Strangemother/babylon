var BABYLON;
(function (BABYLON) {
    var __decoratorInitialStore = {};
    var __mergedStore = {};
    var _copySource = function (creationFunction, source, instanciate) {
        var destination = creationFunction();
        // Tags
        if (BABYLON.Tags) {
            BABYLON.Tags.AddTagsTo(destination, source.tags);
        }
        var classStore = getMergedStore(destination);
        // Properties
        for (var property in classStore) {
            var propertyDescriptor = classStore[property];
            var sourceProperty = source[property];
            var propertyType = propertyDescriptor.type;
            if (sourceProperty !== undefined && sourceProperty !== null) {
                switch (propertyType) {
                    case 0: // Value
                    case 6:// Mesh reference
                        destination[property] = sourceProperty;
                        break;
                    case 1:// Texture
                        destination[property] = (instanciate || sourceProperty.isRenderTarget) ? sourceProperty : sourceProperty.clone();
                        break;
                    case 2: // Color3
                    case 3: // FresnelParameters
                    case 4: // Vector2
                    case 5: // Vector3
                    case 7: // Color Curves
                    case 10:// Quaternion
                        destination[property] = instanciate ? sourceProperty : sourceProperty.clone();
                        break;
                }
            }
        }
        return destination;
    };
    function getDirectStore(target) {
        var classKey = target.getClassName();
        if (!__decoratorInitialStore[classKey]) {
            __decoratorInitialStore[classKey] = {};
        }
        return __decoratorInitialStore[classKey];
    }
    /**
     * Return the list of properties flagged as serializable
     * @param target: host object
     */
    function getMergedStore(target) {
        var classKey = target.getClassName();
        if (__mergedStore[classKey]) {
            return __mergedStore[classKey];
        }
        __mergedStore[classKey] = {};
        var store = __mergedStore[classKey];
        var currentTarget = target;
        var currentKey = classKey;
        while (currentKey) {
            var initialStore = __decoratorInitialStore[currentKey];
            for (var property in initialStore) {
                store[property] = initialStore[property];
            }
            var parent_1 = void 0;
            var done = false;
            do {
                parent_1 = Object.getPrototypeOf(currentTarget);
                if (!parent_1.getClassName) {
                    done = true;
                    break;
                }
                if (parent_1.getClassName() !== currentKey) {
                    break;
                }
                currentTarget = parent_1;
            } while (parent_1);
            if (done) {
                break;
            }
            currentKey = parent_1.getClassName();
            currentTarget = parent_1;
        }
        return store;
    }
    function generateSerializableMember(type, sourceName) {
        return function (target, propertyKey) {
            var classStore = getDirectStore(target);
            if (!classStore[propertyKey]) {
                classStore[propertyKey] = { type: type, sourceName: sourceName };
            }
        };
    }
    function generateExpandMember(setCallback, targetKey) {
        if (targetKey === void 0) { targetKey = null; }
        return function (target, propertyKey) {
            var key = targetKey || ("_" + propertyKey);
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    return this[key];
                },
                set: function (value) {
                    if (this[key] === value) {
                        return;
                    }
                    this[key] = value;
                    target[setCallback].apply(this);
                },
                enumerable: true,
                configurable: true
            });
        };
    }
    function expandToProperty(callback, targetKey) {
        if (targetKey === void 0) { targetKey = null; }
        return generateExpandMember(callback, targetKey);
    }
    BABYLON.expandToProperty = expandToProperty;
    function serialize(sourceName) {
        return generateSerializableMember(0, sourceName); // value member
    }
    BABYLON.serialize = serialize;
    function serializeAsTexture(sourceName) {
        return generateSerializableMember(1, sourceName); // texture member
    }
    BABYLON.serializeAsTexture = serializeAsTexture;
    function serializeAsColor3(sourceName) {
        return generateSerializableMember(2, sourceName); // color3 member
    }
    BABYLON.serializeAsColor3 = serializeAsColor3;
    function serializeAsFresnelParameters(sourceName) {
        return generateSerializableMember(3, sourceName); // fresnel parameters member
    }
    BABYLON.serializeAsFresnelParameters = serializeAsFresnelParameters;
    function serializeAsVector2(sourceName) {
        return generateSerializableMember(4, sourceName); // vector2 member
    }
    BABYLON.serializeAsVector2 = serializeAsVector2;
    function serializeAsVector3(sourceName) {
        return generateSerializableMember(5, sourceName); // vector3 member
    }
    BABYLON.serializeAsVector3 = serializeAsVector3;
    function serializeAsMeshReference(sourceName) {
        return generateSerializableMember(6, sourceName); // mesh reference member
    }
    BABYLON.serializeAsMeshReference = serializeAsMeshReference;
    function serializeAsColorCurves(sourceName) {
        return generateSerializableMember(7, sourceName); // color curves
    }
    BABYLON.serializeAsColorCurves = serializeAsColorCurves;
    function serializeAsColor4(sourceName) {
        return generateSerializableMember(8, sourceName); // color 4
    }
    BABYLON.serializeAsColor4 = serializeAsColor4;
    function serializeAsImageProcessingConfiguration(sourceName) {
        return generateSerializableMember(9, sourceName); // image processing
    }
    BABYLON.serializeAsImageProcessingConfiguration = serializeAsImageProcessingConfiguration;
    function serializeAsQuaternion(sourceName) {
        return generateSerializableMember(10, sourceName); // quaternion member
    }
    BABYLON.serializeAsQuaternion = serializeAsQuaternion;
    var SerializationHelper = /** @class */ (function () {
        function SerializationHelper() {
        }
        SerializationHelper.Serialize = function (entity, serializationObject) {
            if (!serializationObject) {
                serializationObject = {};
            }
            // Tags
            if (BABYLON.Tags) {
                serializationObject.tags = BABYLON.Tags.GetTags(entity);
            }
            var serializedProperties = getMergedStore(entity);
            // Properties
            let map = {
                // Value
                0: function(sp) { return sp; }
                // Texture
                , 1: function(sp) { return sp.serialize(); }
                // Color3
                , 2: function(sp) { return sp.asArray(); }
                // FresnelParameters
                , 3: function(sp) { return sp.serialize(); }
                // Vector2
                , 4: function(sp) { return sp.asArray(); }
                // Vector3
                , 5: function(sp) { return sp.asArray(); }
                // Mesh reference
                , 6: function(sp) { return sp.id; }
                // Color Curves
                , 7: function(sp) { return sp.serialize(); }
                // Color 4
                , 8: function(sp) { return sp.asArray(); }
                // Image Processing
                , 9: function(sp) { return sp.serialize(); }
            }

            for (var property in serializedProperties) {
                var propertyDescriptor = serializedProperties[property];
                var targetPropertyName = propertyDescriptor.sourceName || property;
                var propertyType = propertyDescriptor.type;
                var sourceProperty = entity[property];
                if (sourceProperty !== undefined && sourceProperty !== null) {

                    if(map[sourceProperty] != undefined) {
                        serializationObject[targetPropertyName] = map[sourceProperty](sourceProperty)
                        break
                    }

                    // switch (propertyType) {
                    //     case 0:// Value
                    //         serializationObject[targetPropertyName] = sourceProperty;
                    //         break;
                    //     case 1:// Texture
                    //         serializationObject[targetPropertyName] = sourceProperty.serialize();
                    //         break;
                    //     case 2:// Color3
                    //         serializationObject[targetPropertyName] = sourceProperty.asArray();
                    //         break;
                    //     case 3:// FresnelParameters
                    //         serializationObject[targetPropertyName] = sourceProperty.serialize();
                    //         break;
                    //     case 4:// Vector2
                    //         serializationObject[targetPropertyName] = sourceProperty.asArray();
                    //         break;
                    //     case 5:// Vector3
                    //         serializationObject[targetPropertyName] = sourceProperty.asArray();
                    //         break;
                    //     case 6:// Mesh reference
                    //         serializationObject[targetPropertyName] = sourceProperty.id;
                    //         break;
                    //     case 7:// Color Curves
                    //         serializationObject[targetPropertyName] = sourceProperty.serialize();
                    //         break;
                    //     case 8:// Color 4
                    //         serializationObject[targetPropertyName] = sourceProperty.asArray();
                    //         break;
                    //     case 9:// Image Processing
                    //         serializationObject[targetPropertyName] = sourceProperty.serialize();
                    //         break;
                    // }
                }
            }
            return serializationObject;
        };
        SerializationHelper.Parse = function (creationFunction, source, scene, rootUrl) {
            if (rootUrl === void 0) { rootUrl = null; }
            var destination = creationFunction();
            if (!rootUrl) {
                rootUrl = "";
            }
            // Tags
            if (BABYLON.Tags) {
                BABYLON.Tags.AddTagsTo(destination, source.tags);
            }
            var classStore = getMergedStore(destination);
            // Properties
            for (var property in classStore) {
                var propertyDescriptor = classStore[property];
                var sourceProperty = source[propertyDescriptor.sourceName || property];
                var propertyType = propertyDescriptor.type;
                if (sourceProperty !== undefined && sourceProperty !== null) {
                    var dest = destination;
                    switch (propertyType) {
                        case 0:// Value
                            dest[property] = sourceProperty;
                            break;
                        case 1:// Texture
                            if (scene) {
                                dest[property] = BABYLON.Texture.Parse(sourceProperty, scene, rootUrl);
                            }
                            break;
                        case 2:// Color3
                            dest[property] = BABYLON.Color3.FromArray(sourceProperty);
                            break;
                        case 3:// FresnelParameters
                            dest[property] = BABYLON.FresnelParameters.Parse(sourceProperty);
                            break;
                        case 4:// Vector2
                            dest[property] = BABYLON.Vector2.FromArray(sourceProperty);
                            break;
                        case 5:// Vector3
                            dest[property] = BABYLON.Vector3.FromArray(sourceProperty);
                            break;
                        case 6:// Mesh reference
                            if (scene) {
                                dest[property] = scene.getLastMeshByID(sourceProperty);
                            }
                            break;
                        case 7:// Color Curves
                            dest[property] = BABYLON.ColorCurves.Parse(sourceProperty);
                            break;
                        case 8:// Color 4
                            dest[property] = BABYLON.Color4.FromArray(sourceProperty);
                            break;
                        case 9:// Image Processing
                            dest[property] = BABYLON.ImageProcessingConfiguration.Parse(sourceProperty);
                            break;
                    }
                }
            }
            return destination;
        };
        SerializationHelper.Clone = function (creationFunction, source) {
            return _copySource(creationFunction, source, false);
        };
        SerializationHelper.Instanciate = function (creationFunction, source) {
            return _copySource(creationFunction, source, true);
        };
        return SerializationHelper;
    }());
    BABYLON.SerializationHelper = SerializationHelper;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.decorators.js.map
