class Children {
    /*
    A list given from children to append items to the
    master display list.
    */

    _getSimpleId(parent) {
        if(IT.g(parent).is('string')) {
            return parent;
        }
        return complexID(this._getName(parent))
    }

    _getName(item){
        return item.constructor ? item.constructor.name: (item.id || item.name)
    }

    _parentChildIDName(){
        /* return a string to define the varname in the referenced parent
        */
       return '_childID'
    }

    constructor(parent, dataRoot){

        let self, instance, id

        [id, instance] = this.instance(parent, dataRoot);
        console.log('Children', id, 'for:', instance.id)
        if(this.globalRef() == undefined) {
            this.id = id;
            console.log('new Child:', id)
        };

        return [id, instance];
    }

    instance(parent, dataRoot){

        // Get the current name or generate a new friendly
        let id = parent._childID || this._getSimpleId(parent);
        // Use the global regerence or this - the new instance.
        let parentReference = (this.globalRef() || this);
        // Get children object reference list object. If this does not exist
        // attempt from the parent. If the parent is "this", the dataRoot
        // object will not exist.
        dataRoot = dataRoot || parentReference.getDataRoot()

        dataRoot[id] = []
        console.log("Children parentReference:", id)
        parentReference._childID = id
        return [id, parentReference]
    }

    globalRef(){
        return app_children
    }

    getDataRoot(){
        /* Return the global data reference or return a new object,
        of which will become the master reference if a root is not defined.*/
        if(app_children_data) return app_children_data;
        return {};
    }


    add(item, childBase, options) {
        let obj = item._childID || this._getSimpleId(item)
        let p = childBase._childID
        console.log('Add To', childBase)
        let parent = p || "ROOT"
        console.log(`>  add to this "${this.id}": (item): "${obj}" to parent: "${parent}" of children "${p}"`)
    }

    get children(){
        return this
    }
}


var app_children_data = {};
var [app_ref_id, app_children] = new Children('root', app_children_data)
