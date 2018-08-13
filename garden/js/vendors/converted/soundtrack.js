
var LIB;
(function (LIB) {
    var SoundTrack = /** @class */ (function () {
        function SoundTrack(scene, options) {
            this.id = -1;
            this._isMainTrack = false;
            this._isInitialized = false;
            this._scene = scene;
            this.soundCollection = new Array();
            this._options = options;
            if (!this._isMainTrack) {
                this._scene.soundTracks.push(this);
                this.id = this._scene.soundTracks.length - 1;
            }
        }
        SoundTrack.prototype._initializeSoundTrackAudioGraph = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio && LIB.Engine.audioEngine.audioContext) {
                this._outputAudioNode = LIB.Engine.audioEngine.audioContext.createGain();
                this._outputAudioNode.connect(LIB.Engine.audioEngine.masterGain);
                if (this._options) {
                    if (this._options.volume) {
                        this._outputAudioNode.gain.value = this._options.volume;
                    }
                    if (this._options.mainTrack) {
                        this._isMainTrack = this._options.mainTrack;
                    }
                }
                this._isInitialized = true;
            }
        };
        SoundTrack.prototype.dispose = function () {
            if (LIB.Engine.audioEngine && LIB.Engine.audioEngine.canUseWebAudio) {
                if (this._connectedAnalyser) {
                    this._connectedAnalyser.stopDebugCanvas();
                }
                while (this.soundCollection.length) {
                    this.soundCollection[0].dispose();
                }
                if (this._outputAudioNode) {
                    this._outputAudioNode.disconnect();
                }
                this._outputAudioNode = null;
            }
        };
        SoundTrack.prototype.AddSound = function (sound) {
            if (!this._isInitialized) {
                this._initializeSoundTrackAudioGraph();
            }
            if (LIB.Engine.audioEngine.canUseWebAudio && this._outputAudioNode) {
                sound.connectToSoundTrackAudioNode(this._outputAudioNode);
            }
            if (sound.soundTrackId) {
                if (sound.soundTrackId === -1) {
                    this._scene.mainSoundTrack.RemoveSound(sound);
                }
                else {
                    this._scene.soundTracks[sound.soundTrackId].RemoveSound(sound);
                }
            }
            this.soundCollection.push(sound);
            sound.soundTrackId = this.id;
        };
        SoundTrack.prototype.RemoveSound = function (sound) {
            var index = this.soundCollection.indexOf(sound);
            if (index !== -1) {
                this.soundCollection.splice(index, 1);
            }
        };
        SoundTrack.prototype.setVolume = function (newVolume) {
            if (LIB.Engine.audioEngine.canUseWebAudio && this._outputAudioNode) {
                this._outputAudioNode.gain.value = newVolume;
            }
        };
        SoundTrack.prototype.switchPanningModelToHRTF = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio) {
                for (var i = 0; i < this.soundCollection.length; i++) {
                    this.soundCollection[i].switchPanningModelToHRTF();
                }
            }
        };
        SoundTrack.prototype.switchPanningModelToEqualPower = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio) {
                for (var i = 0; i < this.soundCollection.length; i++) {
                    this.soundCollection[i].switchPanningModelToEqualPower();
                }
            }
        };
        SoundTrack.prototype.connectToAnalyser = function (analyser) {
            if (this._connectedAnalyser) {
                this._connectedAnalyser.stopDebugCanvas();
            }
            this._connectedAnalyser = analyser;
            if (LIB.Engine.audioEngine.canUseWebAudio && this._outputAudioNode) {
                this._outputAudioNode.disconnect();
                this._connectedAnalyser.connectAudioNodes(this._outputAudioNode, LIB.Engine.audioEngine.masterGain);
            }
        };
        return SoundTrack;
    }());
    LIB.SoundTrack = SoundTrack;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.soundtrack.js.map
//# sourceMappingURL=LIB.soundtrack.js.map
