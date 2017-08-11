class DisplayListManager {

    constructor(parent){
        /* Reference set of all children
        If the parent is not defined, the main _instance is used. */

        this._displaySets = {};
        this.parent = parent || _instance;

        // this.id = Math.random().toString(32).slice(2);
    }

    getRenderer(){
        /* Returns a a function for iterating and calling all item.renderLoop
        methods within the display set.*/

        return function(scene, index){

            for(let did in this._displaySets) {
                for(let id in this._displaySets[did][0].itemNameMap){
                    let ref = this._displaySets[did][0].itemNameMap[id];
                    let item = this._displaySets[did][1][ref[1]]

                    if(item == undefined) continue;

                    if(item[0].renderLoop != undefined) {
                        // console.log('call renderLoop')
                        item[0].renderLoop(scene, item[1], index, item[0])
                    }
                }
            }

        }.bind(this)
    }


    get(id){
        return this._displaySets[id]
    }

    set(id, v) {
        this._displaySets[id] = v;
    }

    remove(child) {
        let items;
        if(child._displayListName != undefined) {

            items = this.get(child._displayListName);
            if(items == undefined) {
                console.warn('child has displayListName but no context', child)
                return
            };

            items=items[1]
        } else {
            console.info('No scene element to remove', child)
            return
        }

        if(items == undefined) return

        // let entry = items[child._displayListIndex]
        let removed = items[child._displayListIndex];
        if(removed.length > 0) {
            this._displaySets[child._displayListName][1][child._displayListIndex] = undefined
            delete child._displayListIndex;
            delete child._displayListName;
        }

        return removed[0]
    }

    childList() {
        let r = new ChildList(this.parent, this);
        this._displaySets[r.id] = [r, []];


        return r;
    }

    destroy(){
        /* destroy all children */
        let children = this._displaySets
            , item
            , removed
            ;

        for(let key in children) {
            children[key][0].destroy()
            delete children[key]
        }
    }
}


class ChildList {
    /* A ChildList maintains a connection to a the _displayList,
    managing lists of display entities. */

    constructor(parent, owner){
        this.parent = parent;
        this.name = {};
        this.meshNameMap = {};
        this.itemNameMap = {};
        this._onAdd = {}
        this._onBefore = {}

        // Items removed from the _onAdd and _onBefore chains
        // are flagged for deletion during iteration, then
        // cleared after all are done.
        this._deletions = [];

        this.id = Math.random().toString(32).slice(2);
        this.createIterators()
    }

    iterators(){
        return [
            'preModifiers'
            , 'postModifiers'
        ]
    }

    createIterators(d){
        this._iterators = d || {}
        for(let n of this.iterators()) {
            this[n] = this._iterators[n] = new SimpleIter()
        }
    }

    callIterator(name, items, ...args) {

        for(let item of items) {
            this._iterators[name].call(item, ...args)
        }
    }

    get displayList() {
        /* Return the relative display list containing all children */
        return _instance.displayListManager.get(this.id)[1]
    }

    set displayList(v){
        /* return the relative display list for this childlist. */
        _instance.displayListManager.set(this.id, v)
    }

    /* A chainable read list for instances of information for the view.*/
    add(children, options) {
        /* Add an item to the list of children*/

        let items = children;
        if(!Array.isArray(children)) {
            items = [children];
        }

        let meshes=[], mesh;
        let bSet = this.parent._app.babylonSet
        let [scene, engine, canvas] = bSet;

        this._addBefore(items, options, scene, engine, canvas)

        this.callIterator('preModifiers', items, options, ...bSet)

        for(let item of items) {
            mesh = item.create(options, scene);
            this.append(item, mesh, options);
            meshes.push(mesh);
        };


        this.callIterator('postModifiers', meshes, options, ...bSet)
        this._addAfter(items, meshes, options, scene, engine, canvas)
        this._deleteFlagged()
        // User did not pass an array, therefore return one mesh.
        if(!Array.isArray(children)) return mesh;

        return meshes;
    }

    _addBefore(items, options, scene, engine, canvas) {
        /* Called before an item .add() is modified or created*/
        let _cbs, id;
        let item;

        for (var i = 0; i < items.length; i++) {
            item = items[i]
            id = item.id
            _cbs = this._onBefore[id] || [];
            for (var j = 0; j < _cbs.length; j++) {
                let [func, once, scope] = _cbs[j]
                func.call(scope || this, item, meshes[i], options, scene, engine, canvas)
                if(once == true) {
                    this._flagDelete('_onBefore', id, j)
                }
            }
        }
    }

    _addAfter(items, meshes, options, scene, engine, canvas) {
        /* Called after an item .add() is modified or created*/
        let _cbs, id;
        let item;

        for (var i = 0; i < items.length; i++) {
            item = items[i]
            id = item.id
            _cbs = this._onAdd[id] || [];
            for (var j = 0; j < _cbs.length; j++) {
                let [func, once, scope] = _cbs[j]
                func.call(scope || this, item, meshes[i], options, scene, engine, canvas)
                if(once == true) {
                    this._flagDelete('_onAdd', id, j)
                }
            }
        }
    }

    _flagDelete(name, id, index) {
        this._deletions.push(arguments)
    }

    _deleteFlagged() {
        for(let [name, id, index] of this._deletions) {
            this[name][id].splice(index, 1)
            if(this[name][id].length == 0) {
                delete this[name][id]
            }
        }

        this._deletions = [];
    }

    onAdd(id, callback, once=false, scope) {
        /* Call a function when the element of ID is given.
        If once=true, the callback will delete once called */
        let l = this._onAdd[id] || [];
        l.push([callback, once, scope])

        this._onAdd[id] = l

    }

    onBeforeAdd(id, callback, once=false, scope) {
        /* Call a function when the element of ID is given.
        If once=true, the callback will delete once called */
        let l = this._onBefore[id] || [];
        l.push([callback, once, scope])

        this._onBefore[id] = l
    }

    addMany(...children) {
        /* Calls add() for every item given */
        return this.add(children)
    }

    getItemNameByMesh(idOrMesh, i=0) {
        return this.meshNameMap[idOrMesh.id || idOrMesh][1]
    }

    getMeshNameByItem(idOrMesh, i=0) {
        return this.meshNameMap[idOrMesh.id || idOrMesh][1]
    }

    getBy(idOrMesh, choice=-1) {
        let index = this.getMeshNameByItem(idOrMesh, 1);
        if(!index) index = this.getItemNameByMesh(idOrMesh, 1);

        let l = this.displayList[index]
        if(choice != -1) {
            return l[choice]
        }
        return l
    }

    getItem(item){
        return this.getBy(item, 0)
    }

    getMesh(item){
        return this.getBy(item, 1)
    }

    append(item, mesh, options) {

        let v = [item, mesh, options];
        // give item index and child list reference
        let index = -1 + this.displayList.push(v);

        item._displayListIndex = index;
        item._displayListName = this.id;
        this.meshNameMap[mesh.id] = [item.id, index]
        this.itemNameMap[item.id] = [mesh.id, index]

        // Add to master list
        // _displayList[item.id] = v
        return index;
    }

    destroy(){
        /* destroy all children */
        let children = this.displayList
            , item
            , removed
            ;

        for(let child of children) {
            if(child == undefined) continue;
            if(child[0].destroy){
                item = child[0].destroy();
            } else {
                child[1].dispose()
            }
        }

        this.meshNameMap = {};
    }
}


class ChildManager extends BaseClass {

    constructor(){
        super(...arguments)
        this.id = Math.random().toString(32).slice(2);
    }

    get _childList(){
        /* Reutrn the relative childList - the displayList controller*/
        return _instance.displayListManager.get(this._displayListName)[0]
    }

    get _displayList(){
        /* Return relative array displaylist */
        if(this._displayListName == undefined) return undefined;
        return _instance.displayListManager.get(this._displayListName)[1]
    }

    get _babylon() {
        if(this._babylon_node) return this._babylon_node
        if(this._displayListName == undefined) return undefined
        let dl = this._displayList[this._displayListIndex];
        if(dl != undefined) {
            return dl[1]
        }

        return undefined;
    }

    set _babylon(babylonItem) {
        /* override the babylon instance with an internal value, omiting the
        displayList*/
        this._babylon_node = babylonItem
    }
}

