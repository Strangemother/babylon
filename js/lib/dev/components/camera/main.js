class CameraComponent extends Component {

    name(){
        return 'camera'
    }

    init(elements){
        /* Initialize the object, creating data bind points with
        default values.*/
        var [x, y, z] = [3,4,5];
        this.rotation = {x, y, z};
        this.position = {x, y, z};
        this.fov = .8;

        this.unbound = false;
    }

    events(){
        return {
            gamescenerun: this.gameSceneRunEvent
            , camera: this.cameraEvent
        };
    }

    saveValues(e) {
        /* Called by the UI actions to apply the content
        and rebind */
        this.applyValues();
        this.unbound = false;
    }

    applyValues(){
        /* Store the data positions into bablyon*/
        if(window.g == undefined) return;

        g.camera.position = this.asVector(this.data.position);
        g.camera.rotation = this.asVector(this.data.rotation);
    }

    asVector(data) {
        /* convert the given object to a BABYLON.Vector3*/
        var pf = parseFloat;
        return new BABYLON.Vector3(pf(data.x), pf(data.y), pf(data.z));
    }

    gameSceneRunEvent(e) {
        /* gamescenerun event was dispatched,
        add a camera input device to capture changes in BABYLON */
        var cce = new CameraComponentEvent();
        e.data.interface.camera.inputs.add(cce);
    }

    cameraEvent(e) {
        /* camera event handler, dispatched from the 'checkInputs of the
        pseudo camera input object. */

        // throttle the view update
        if(!this.tick()) return;

        // Only update if we're in bound mode.
        if(this.unbound == false) {
            // push the data from BABYLON into out data object.
            this.updateData(e.data);
            // apply the data changes to the data binding objects.
            this.fov = e.data.fov;
            this.rotation = this.data.rotation;
            this.position = this.data.position;
        };
    }

    updateData(data){
        /* Iterate the data object and safely update the internal data object.
        This ensures compatability with UI bind objects.*/
        var camera = data
            , posKeys = ['x', 'y', 'z']
            , items = ['rotation', 'position']
            , item, _set , key
            , _v, i, j
            ;

        for (i = 0; i < items.length; i++) {
            item = items[i];
            _set =  this.data[item] = (this.data[item] === undefined) ? {}: this.data[item];

            for (j = 0; j < posKeys.length; j++) {
                key = posKeys[j];
                // Clean up output for easier reading.
                _v = parseFloat(camera[item][key]).toFixed(3)
                if( _set[key] != _v) {
                    _set[key] = _v;
                };
            };
        };
    }

    config(){
        console.log('config action')
        dispatchNativeEvent('configure', this)
    }
}


class CameraComponentEvent {
    getTypeName() { return 'CameraComponentEvent' }
    getSimpleName(){ return 'cce' }

    attachControl(element, noPreventDefault){}
    detachControl(element){}

    checkInputs(){
        dispatchNativeEvent('camera', this.camera)
    }
}

Components.register('camera', CameraComponent)

