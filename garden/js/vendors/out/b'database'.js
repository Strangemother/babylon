
var LIB;
(function (LIB) {
    /**
     * Class used to enable access to IndexedDB
     * @see @https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
     */
    var Database = /** @class */ (function () {
        /**
         * Creates a new Database
         * @param urlToScene defines the url to load the scene
         * @param callbackManifestChecked defines the callback to use when manifest is checked
         * @param disableManifestCheck defines a boolean indicating that we want to skip the manifest validation (it will be considered validated and up to date)
         */
        function Database(urlToScene, callbackManifestChecked, disableManifestCheck) {
            if (disableManifestCheck === void 0) { disableManifestCheck = false; }
            var _this = this;
            // Handling various flavors of prefixed version of IndexedDB
            this.idbFactory = (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB);
            this.callbackManifestChecked = callbackManifestChecked;
            this.currentSceneUrl = Database._ReturnFullUrlLocation(urlToScene);
            this.db = null;
            this._enableSceneOffline = false;
            this._enableTexturesOffline = false;
            this.manifestVersionFound = 0;
            this.mustUpdateRessources = false;
            this.hasReachedQuota = false;
            if (!Database.IDBStorageEnabled) {
                this.callbackManifestChecked(true);
            }
            else {
                if (disableManifestCheck) {
                    this._enableSceneOffline = true;
                    this._enableTexturesOffline = true;
                    this.manifestVersionFound = 1;
                    LIB.Tools.SetImmediate(function () {
                        _this.callbackManifestChecked(true);
                    });
                }
                else {
                    this._checkManifestFile();
                }
            }
        }
        Object.defineProperty(Database.prototype, "enableSceneOffline", {
            /**
             * Gets a boolean indicating if scene must be saved in the database
             */
            get: function () {
                return this._enableSceneOffline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Database.prototype, "enableTexturesOffline", {
            /**
             * Gets a boolean indicating if textures must be saved in the database
             */
            get: function () {
                return this._enableTexturesOffline;
            },
            enumerable: true,
            configurable: true
        });
        Database.prototype._checkManifestFile = function () {
            var _this = this;
            var noManifestFile = function () {
                _this._enableSceneOffline = false;
                _this._enableTexturesOffline = false;
                _this.callbackManifestChecked(false);
            };
            var timeStampUsed = false;
            var manifestURL = this.currentSceneUrl + ".manifest";
            var xhr = new XMLHttpRequest();
            if (navigator.onLine) {
                // Adding a timestamp to by-pass browsers' cache
                timeStampUsed = true;
                manifestURL = manifestURL + (manifestURL.match(/\?/) == null ? "?" : "&") + Date.now();
            }
            xhr.open("GET", manifestURL, true);
            xhr.addEventListener("load", function () {
                if (xhr.status === 200 || LIB.Tools.ValidateXHRData(xhr, 1)) {
                    try {
                        var manifestFile = JSON.parse(xhr.response);
                        _this._enableSceneOffline = manifestFile.enableSceneOffline;
                        _this._enableTexturesOffline = manifestFile.enableTexturesOffline;
                        if (manifestFile.version && !isNaN(parseInt(manifestFile.version))) {
                            _this.manifestVersionFound = manifestFile.version;
                        }
                        if (_this.callbackManifestChecked) {
                            _this.callbackManifestChecked(true);
                        }
                    }
                    catch (ex) {
                        noManifestFile();
                    }
                }
                else {
                    noManifestFile();
                }
            }, false);
            xhr.addEventListener("error", function (event) {
                if (timeStampUsed) {
                    timeStampUsed = false;
                    // Let's retry without the timeStamp
                    // It could fail when coupled with HTML5 Offline API
                    var retryManifestURL = _this.currentSceneUrl + ".manifest";
                    xhr.open("GET", retryManifestURL, true);
                    xhr.send();
                }
                else {
                    noManifestFile();
                }
            }, false);
            try {
                xhr.send();
            }
            catch (ex) {
                LIB.Tools.Error("Error on XHR send request.");
                this.callbackManifestChecked(false);
            }
        };
        /**
         * Open the database and make it available
         * @param successCallback defines the callback to call on success
         * @param errorCallback defines the callback to call on error
         */
        Database.prototype.openAsync = function (successCallback, errorCallback) {
            var _this = this;
            var handleError = function () {
                _this.isSupported = false;
                if (errorCallback)
                    errorCallback();
            };
            if (!this.idbFactory || !(this._enableSceneOffline || this._enableTexturesOffline)) {
                // Your browser doesn't support IndexedDB
                this.isSupported = false;
                if (errorCallback)
                    errorCallback();
            }
            else {
                // If the DB hasn't been opened or created yet
                if (!this.db) {
                    this.hasReachedQuota = false;
                    this.isSupported = true;
                    var request = this.idbFactory.open("LIBjs", 1);
                    // Could occur if user is blocking the quota for the DB and/or doesn't grant access to IndexedDB
                    request.onerror = function (event) {
                        handleError();
                    };
                    // executes when a version change transaction cannot complete due to other active transactions
                    request.onblocked = function (event) {
                        LIB.Tools.Error("IDB request blocked. Please reload the page.");
                        handleError();
                    };
                    // DB has been opened successfully
                    request.onsuccess = function (event) {
                        _this.db = request.result;
                        successCallback();
                    };
                    // Initialization of the DB. Creating Scenes & Textures stores
                    request.onupgradeneeded = function (event) {
                        _this.db = (event.target).result;
                        if (_this.db) {
                            try {
                                _this.db.createObjectStore("scenes", { keyPath: "sceneUrl" });
                                _this.db.createObjectStore("versions", { keyPath: "sceneUrl" });
                                _this.db.createObjectStore("textures", { keyPath: "textureUrl" });
                            }
                            catch (ex) {
                                LIB.Tools.Error("Error while creating object stores. Exception: " + ex.message);
                                handleError();
                            }
                        }
                    };
                }
                // DB has already been created and opened
                else {
                    if (successCallback)
                        successCallback();
                }
            }
        };
        /**
         * Loads an image from the database
         * @param url defines the url to load from
         * @param image defines the target DOM image
         */
        Database.prototype.loadImageFromDB = function (url, image) {
            var _this = this;
            var completeURL = Database._ReturnFullUrlLocation(url);
            var saveAndLoadImage = function () {
                if (!_this.hasReachedQuota && _this.db !== null) {
                    // the texture is not yet in the DB, let's try to save it
                    _this._saveImageIntoDBAsync(completeURL, image);
                }
                // If the texture is not in the DB and we've reached the DB quota limit
                // let's load it directly from the web
                else {
                    image.src = url;
                }
            };
            if (!this.mustUpdateRessources) {
                this._loadImageFromDBAsync(completeURL, image, saveAndLoadImage);
            }
            // First time we're download the images or update requested in the manifest file by a version change
            else {
                saveAndLoadImage();
            }
        };
        Database.prototype._loadImageFromDBAsync = function (url, image, notInDBCallback) {
            if (this.isSupported && this.db !== null) {
                var texture;
                var transaction = this.db.transaction(["textures"]);
                transaction.onabort = function (event) {
                    image.src = url;
                };
                transaction.oncomplete = function (event) {
                    var blobTextureURL;
                    if (texture) {
                        var URL = window.URL || window.webkitURL;
                        blobTextureURL = URL.createObjectURL(texture.data, { oneTimeOnly: true });
                        image.onerror = function () {
                            LIB.Tools.Error("Error loading image from blob URL: " + blobTextureURL + " switching back to web url: " + url);
                            image.src = url;
                        };
                        image.src = blobTextureURL;
                    }
                    else {
                        notInDBCallback();
                    }
                };
                var getRequest = transaction.objectStore("textures").get(url);
                getRequest.onsuccess = function (event) {
                    texture = (event.target).result;
                };
                getRequest.onerror = function (event) {
                    LIB.Tools.Error("Error loading texture " + url + " from DB.");
                    image.src = url;
                };
            }
            else {
                LIB.Tools.Error("Error: IndexedDB not supported by your browser or LIBJS Database is not open.");
                image.src = url;
            }
        };
        Database.prototype._saveImageIntoDBAsync = function (url, image) {
            var _this = this;
            if (this.isSupported) {
                // In case of error (type not supported or quota exceeded), we're at least sending back XHR data to allow texture loading later on
                var generateBlobUrl = function () {
                    var blobTextureURL;
                    if (blob) {
                        var URL = window.URL || window.webkitURL;
                        try {
                            blobTextureURL = URL.createObjectURL(blob, { oneTimeOnly: true });
                        }
                        // Chrome is raising a type error if we're setting the oneTimeOnly parameter
                        catch (ex) {
                            blobTextureURL = URL.createObjectURL(blob);
                        }
                    }
                    if (blobTextureURL) {
                        image.src = blobTextureURL;
                    }
                };
                if (Database.IsUASupportingBlobStorage) { // Create XHR
                    var xhr = new XMLHttpRequest(), blob;
                    xhr.open("GET", url, true);
                    xhr.responseType = "blob";
                    xhr.addEventListener("load", function () {
                        if (xhr.status === 200 && _this.db) {
                            // Blob as response (XHR2)
                            blob = xhr.response;
                            var transaction = _this.db.transaction(["textures"], "readwrite");
                            // the transaction could abort because of a QuotaExceededError error
                            transaction.onabort = function (event) {
                                try {
                                    //backwards compatibility with ts 1.0, srcElement doesn't have an "error" according to ts 1.3
                                    var srcElement = (event.srcElement || event.target);
                                    var error = srcElement.error;
                                    if (error && error.name === "QuotaExceededError") {
                                        _this.hasReachedQuota = true;
                                    }
                                }
                                catch (ex) { }
                                generateBlobUrl();
                            };
                            transaction.oncomplete = function (event) {
                                generateBlobUrl();
                            };
                            var newTexture = { textureUrl: url, data: blob };
                            try {
                                // Put the blob into the dabase
                                var addRequest = transaction.objectStore("textures").put(newTexture);
                                addRequest.onsuccess = function (event) {
                                };
                                addRequest.onerror = function (event) {
                                    generateBlobUrl();
                                };
                            }
                            catch (ex) {
                                // "DataCloneError" generated by Chrome when you try to inject blob into IndexedDB
                                if (ex.code === 25) {
                                    Database.IsUASupportingBlobStorage = false;
                                }
                                image.src = url;
                            }
                        }
                        else {
                            image.src = url;
                        }
                    }, false);
                    xhr.addEventListener("error", function (event) {
                        LIB.Tools.Error("Error in XHR request in LIB.Database.");
                        image.src = url;
                    }, false);
                    xhr.send();
                }
                else {
                    image.src = url;
                }
            }
            else {
                LIB.Tools.Error("Error: IndexedDB not supported by your browser or LIBJS Database is not open.");
                image.src = url;
            }
        };
        Database.prototype._checkVersionFromDB = function (url, versionLoaded) {
            var _this = this;
            var updateVersion = function () {
                // the version is not yet in the DB or we need to update it
                _this._saveVersionIntoDBAsync(url, versionLoaded);
            };
            this._loadVersionFromDBAsync(url, versionLoaded, updateVersion);
        };
        Database.prototype._loadVersionFromDBAsync = function (url, callback, updateInDBCallback) {
            var _this = this;
            if (this.isSupported && this.db) {
                var version;
                try {
                    var transaction = this.db.transaction(["versions"]);
                    transaction.oncomplete = function (event) {
                        if (version) {
                            // If the version in the JSON file is different from the version in DB
                            if (_this.manifestVersionFound !== version.data) {
                                _this.mustUpdateRessources = true;
                                updateInDBCallback();
                            }
                            else {
                                callback(version.data);
                            }
                        }
                        // version was not found in DB
                        else {
                            _this.mustUpdateRessources = true;
                            updateInDBCallback();
                        }
                    };
                    transaction.onabort = function (event) {
                        callback(-1);
                    };
                    var getRequest = transaction.objectStore("versions").get(url);
                    getRequest.onsuccess = function (event) {
                        version = (event.target).result;
                    };
                    getRequest.onerror = function (event) {
                        LIB.Tools.Error("Error loading version for scene " + url + " from DB.");
                        callback(-1);
                    };
                }
                catch (ex) {
                    LIB.Tools.Error("Error while accessing 'versions' object store (READ OP). Exception: " + ex.message);
                    callback(-1);
                }
            }
            else {
                LIB.Tools.Error("Error: IndexedDB not supported by your browser or LIBJS Database is not open.");
                callback(-1);
            }
        };
        Database.prototype._saveVersionIntoDBAsync = function (url, callback) {
            var _this = this;
            if (this.isSupported && !this.hasReachedQuota && this.db) {
                try {
                    // Open a transaction to the database
                    var transaction = this.db.transaction(["versions"], "readwrite");
                    // the transaction could abort because of a QuotaExceededError error
                    transaction.onabort = function (event) {
                        try { //backwards compatibility with ts 1.0, srcElement doesn't have an "error" according to ts 1.3
                            var error = event.srcElement['error'];
                            if (error && error.name === "QuotaExceededError") {
                                _this.hasReachedQuota = true;
                            }
                        }
                        catch (ex) { }
                        callback(-1);
                    };
                    transaction.oncomplete = function (event) {
                        callback(_this.manifestVersionFound);
                    };
                    var newVersion = { sceneUrl: url, data: this.manifestVersionFound };
                    // Put the scene into the database
                    var addRequest = transaction.objectStore("versions").put(newVersion);
                    addRequest.onsuccess = function (event) {
                    };
                    addRequest.onerror = function (event) {
                        LIB.Tools.Error("Error in DB add version request in LIB.Database.");
                    };
                }
                catch (ex) {
                    LIB.Tools.Error("Error while accessing 'versions' object store (WRITE OP). Exception: " + ex.message);
                    callback(-1);
                }
            }
            else {
                callback(-1);
            }
        };
        /**
         * Loads a file from database
         * @param url defines the URL to load from
         * @param sceneLoaded defines a callback to call on success
         * @param progressCallBack defines a callback to call when progress changed
         * @param errorCallback defines a callback to call on error
         * @param useArrayBuffer defines a boolean to use array buffer instead of text string
         */
        Database.prototype.loadFileFromDB = function (url, sceneLoaded, progressCallBack, errorCallback, useArrayBuffer) {
            var _this = this;
            var completeUrl = Database._ReturnFullUrlLocation(url);
            var saveAndLoadFile = function () {
                // the scene is not yet in the DB, let's try to save it
                _this._saveFileIntoDBAsync(completeUrl, sceneLoaded, progressCallBack);
            };
            this._checkVersionFromDB(completeUrl, function (version) {
                if (version !== -1) {
                    if (!_this.mustUpdateRessources) {
                        _this._loadFileFromDBAsync(completeUrl, sceneLoaded, saveAndLoadFile, useArrayBuffer);
                    }
                    else {
                        _this._saveFileIntoDBAsync(completeUrl, sceneLoaded, progressCallBack, useArrayBuffer);
                    }
                }
                else {
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            });
        };
        Database.prototype._loadFileFromDBAsync = function (url, callback, notInDBCallback, useArrayBuffer) {
            if (this.isSupported && this.db) {
                var targetStore;
                if (url.indexOf(".LIB") !== -1) {
                    targetStore = "scenes";
                }
                else {
                    targetStore = "textures";
                }
                var file;
                var transaction = this.db.transaction([targetStore]);
                transaction.oncomplete = function (event) {
                    if (file) {
                        callback(file.data);
                    }
                    // file was not found in DB
                    else {
                        notInDBCallback();
                    }
                };
                transaction.onabort = function (event) {
                    notInDBCallback();
                };
                var getRequest = transaction.objectStore(targetStore).get(url);
                getRequest.onsuccess = function (event) {
                    file = (event.target).result;
                };
                getRequest.onerror = function (event) {
                    LIB.Tools.Error("Error loading file " + url + " from DB.");
                    notInDBCallback();
                };
            }
            else {
                LIB.Tools.Error("Error: IndexedDB not supported by your browser or LIBJS Database is not open.");
                callback();
            }
        };
        Database.prototype._saveFileIntoDBAsync = function (url, callback, progressCallback, useArrayBuffer) {
            var _this = this;
            if (this.isSupported) {
                var targetStore;
                if (url.indexOf(".LIB") !== -1) {
                    targetStore = "scenes";
                }
                else {
                    targetStore = "textures";
                }
                // Create XHR
                var xhr = new XMLHttpRequest();
                var fileData;
                xhr.open("GET", url, true);
                if (useArrayBuffer) {
                    xhr.responseType = "arraybuffer";
                }
                if (progressCallback) {
                    xhr.onprogress = progressCallback;
                }
                xhr.addEventListener("load", function () {
                    if (xhr.status === 200 || LIB.Tools.ValidateXHRData(xhr, !useArrayBuffer ? 1 : 6)) {
                        // Blob as response (XHR2)
                        //fileData = xhr.responseText;
                        fileData = !useArrayBuffer ? xhr.responseText : xhr.response;
                        if (!_this.hasReachedQuota && _this.db) {
                            // Open a transaction to the database
                            var transaction = _this.db.transaction([targetStore], "readwrite");
                            // the transaction could abort because of a QuotaExceededError error
                            transaction.onabort = function (event) {
                                try {
                                    //backwards compatibility with ts 1.0, srcElement doesn't have an "error" according to ts 1.3
                                    var error = event.srcElement['error'];
                                    if (error && error.name === "QuotaExceededError") {
                                        _this.hasReachedQuota = true;
                                    }
                                }
                                catch (ex) { }
                                callback(fileData);
                            };
                            transaction.oncomplete = function (event) {
                                callback(fileData);
                            };
                            var newFile;
                            if (targetStore === "scenes") {
                                newFile = { sceneUrl: url, data: fileData, version: _this.manifestVersionFound };
                            }
                            else {
                                newFile = { textureUrl: url, data: fileData };
                            }
                            try {
                                // Put the scene into the database
                                var addRequest = transaction.objectStore(targetStore).put(newFile);
                                addRequest.onsuccess = function (event) {
                                };
                                addRequest.onerror = function (event) {
                                    LIB.Tools.Error("Error in DB add file request in LIB.Database.");
                                };
                            }
                            catch (ex) {
                                callback(fileData);
                            }
                        }
                        else {
                            callback(fileData);
                        }
                    }
                    else {
                        callback();
                    }
                }, false);
                xhr.addEventListener("error", function (event) {
                    LIB.Tools.Error("error on XHR request.");
                    callback();
                }, false);
                xhr.send();
            }
            else {
                LIB.Tools.Error("Error: IndexedDB not supported by your browser or LIBJS Database is not open.");
                callback();
            }
        };
        /** Gets a boolean indicating if the user agent supports blob storage (this value will be updated after creating the first Database object) */
        Database.IsUASupportingBlobStorage = true;
        /** Gets a boolean indicating if Database storate is enabled */
        Database.IDBStorageEnabled = true;
        Database._ParseURL = function (url) {
            var a = document.createElement('a');
            a.href = url;
            var urlWithoutHash = url.substring(0, url.lastIndexOf("#"));
            var fileName = url.substring(urlWithoutHash.lastIndexOf("/") + 1, url.length);
            var absLocation = url.substring(0, url.indexOf(fileName, 0));
            return absLocation;
        };
        Database._ReturnFullUrlLocation = function (url) {
            if (url.indexOf("http:/") === -1 && url.indexOf("https:/") === -1) {
                return (Database._ParseURL(window.location.href) + url);
            }
            else {
                return url;
            }
        };
        return Database;
    }());
    LIB.Database = Database;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.database.js.map
//# sourceMappingURL=LIB.database.js.map
