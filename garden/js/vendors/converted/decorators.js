
var LIB;
(function (LIB) {
    var __decoratorInitialStore = {};
    var __mergedStore = {};
    var _copySource = function (creationFunction, source, instanciate) {
        var destination = creationFunction();
        // Tags
        if (LIB.Tags) {
            LIB.Tags.AddTagsTo(destination, source.tags);
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
                    case 6: // Mesh reference
                    case 11: // Camera reference
                        destination[property] = sourceProperty;
                        break;
                    case 1: // Texture
                        destination[property] = (instanciate || sourceProperty.isRenderTarget) ? sourceProperty : sourceProperty.clone();
                        break;
                    case 2: // Color3
                    case 3: // FresnelParameters
                    case 4: // Vector2
                    case 5: // Vector3
                    case 7: // Color Curves
                    case 10: // Quaternion
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
    LIB.expandToProperty = expandToProperty;
    function serialize(sourceName) {
        return generateSerializableMember(0, sourceName); // value member
    }
    LIB.serialize = serialize;
    function serializeAsTexture(sourceName) {
        return generateSerializableMember(1, sourceName); // texture member
    }
    LIB.serializeAsTexture = serializeAsTexture;
    function serializeAsColor3(sourceName) {
        return generateSerializableMember(2, sourceName); // color3 member
    }
    LIB.serializeAsColor3 = serializeAsColor3;
    function serializeAsFresnelParameters(sourceName) {
        return generateSerializableMember(3, sourceName); // fresnel parameters member
    }
    LIB.serializeAsFresnelParameters = serializeAsFresnelParameters;
    function serializeAsVector2(sourceName) {
        return generateSerializableMember(4, sourceName); // vector2 member
    }
    LIB.serializeAsVector2 = serializeAsVector2;
    function serializeAsVector3(sourceName) {
        return generateSerializableMember(5, sourceName); // vector3 member
    }
    LIB.serializeAsVector3 = serializeAsVector3;
    function serializeAsMeshReference(sourceName) {
        return generateSerializableMember(6, sourceName); // mesh reference member
    }
    LIB.serializeAsMeshReference = serializeAsMeshReference;
    function serializeAsColorCurves(sourceName) {
        return generateSerializableMember(7, sourceName); // color curves
    }
    LIB.serializeAsColorCurves = serializeAsColorCurves;
    function serializeAsColor4(sourceName) {
        return generateSerializableMember(8, sourceName); // color 4
    }
    LIB.serializeAsColor4 = serializeAsColor4;
    function serializeAsImageProcessingConfiguration(sourceName) {
        return generateSerializableMember(9, sourceName); // image processing
    }
    LIB.serializeAsImageProcessingConfiguration = serializeAsImageProcessingConfiguration;
    function serializeAsQuaternion(sourceName) {
        return generateSerializableMember(10, sourceName); // quaternion member
    }
    LIB.serializeAsQuaternion = serializeAsQuaternion;
    /**
     * Decorator used to define property that can be serialized as reference to a camera
     * @param sourceName defines the name of the property to decorate
     */
    function serializeAsCameraReference(sourceName) {
        return generateSerializableMember(11, sourceName); // camera reference member
    }
    LIB.serializeAsCameraReference = serializeAsCameraReference;
    var SerializationHelper = /** @class */ (function () {
        function SerializationHelper() {
        }
        SerializationHelper.Serialize = function (entity, serializationObject) {
            if (!serializationObject) {
                serializationObject = {};
            }
            // Tags
            if (LIB.Tags) {
                serializationObject.tags = LIB.Tags.GetTags(entity);
            }
            var serializedProperties = getMergedStore(entity);
            // Properties
            for (var property in serializedProperties) {
                var propertyDescriptor = serializedProperties[property];
                var targetPropertyName = propertyDescriptor.sourceName || property;
                var propertyType = propertyDescriptor.type;
                var sourceProperty = entity[property];
                if (sourceProperty !== undefined && sourceProperty !== null) {
                    switch (propertyType) {
                        case 0: // Value
                            serializationObject[targetPropertyName] = sourceProperty;
                            break;
                        case 1: // Texture
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;
                        case 2: // Color3
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;
                        case 3: // FresnelParameters
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;
                        case 4: // Vector2
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;
                        case 5: // Vector3
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;
                        case 6: // Mesh reference
                            serializationObject[targetPropertyName] = sourceProperty.id;
                            break;
                        case 7: // Color Curves
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;
                        case 8: // Color 4
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;
                        case 9: // Image Processing
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;
                        case 10: // Quaternion
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;
                        case 11: // Camera reference
                            serializationObject[targetPropertyName] = sourceProperty.id;
                            break;
                    }
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
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(destination, source.tags);
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
                        case 0: // Value
                            dest[property] = sourceProperty;
                            break;
                        case 1: // Texture
                            if (scene) {
                                dest[property] = LIB.Texture.Parse(sourceProperty, scene, rootUrl);
                            }
                            break;
                        case 2: // Color3
                            dest[property] = LIB.Color3.FromArray(sourceProperty);
                            break;
                        case 3: // FresnelParameters
                            dest[property] = LIB.FresnelParameters.Parse(sourceProperty);
                            break;
                        case 4: // Vector2
                            dest[property] = LIB.Vector2.FromArray(sourceProperty);
                            break;
                        case 5: // Vector3
                            dest[property] = LIB.Vector3.FromArray(sourceProperty);
                            break;
                        case 6: // Mesh reference
                            if (scene) {
                                dest[property] = scene.getLastMeshByID(sourceProperty);
                            }
                            break;
                        case 7: // Color Curves
                            dest[property] = LIB.ColorCurves.Parse(sourceProperty);
                            break;
                        case 8: // Color 4
                            dest[property] = LIB.Color4.FromArray(sourceProperty);
                            break;
                        case 9: // Image Processing
                            dest[property] = LIB.ImageProcessingConfiguration.Parse(sourceProperty);
                            break;
                        case 10: // Quaternion
                            dest[property] = LIB.Quaternion.FromArray(sourceProperty);
                            break;
                        case 11: // Camera reference
                            if (scene) {
                                dest[property] = scene.getCameraByID(sourceProperty);
                            }
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
    LIB.SerializationHelper = SerializationHelper;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.decorators.js.map
//# sourceMappingURL=LIB.decorators.js.map
