

class DisplayListManager {

    constructor(parent){
        /* Reference set of all children
        If the parent is not defined, the main _instance is used. */

        this._displaySets = {};
        this.parent = parent || _instance;
        // this.id = Math.random().toString(32).slice(2);
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
        let r = new ChildList(this.parent);
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

class SimpleIter {

    constructor(d){
        this._ = d || {}
    }

    add(name, func, iterExisting=false) {
        if(this._[name] == undefined) {
            this._[name] = []
        }

        this._[name].push(func);
    }

    call(...args) {
        let v;
        for(let k in this._) {
            for(let f of this._[k]) {
                v = f(...args)
                if(v === null) console.warn('iterator', k, 'for', args[0], 'returned null')
            }
        }
    }

    remove(name, func) {
        let removed = []
        if(func != undefined) {
            let n = this._[name];
            if(n != undefined) {
                let i = this._[name].indexOf(func);
                if(i>-1){
                    removed = this._[name].splice(i, 1)
                }
            }
        } else if(this._[name] != undefined){
            removed = this._[name]
            delete this._[name]
        }
        return removed;
    }
}


class ChildList {
    /* A ChildList maintains a connection to a the _displayList,
    managing lists of display entities. */

    constructor(parent){
        this.parent = parent;
        this.name = {};
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

        this.callIterator('preModifiers', items, options, ...bSet)

        for(let item of items) {
            mesh = item.create(options, scene);
            this.append(item, mesh, options);
            meshes.push(mesh);
        };

        this.callIterator('postModifiers', meshes, options, ...bSet)

        // User did not pass an array, therefore return one mesh.
        if(!Array.isArray(children)) return mesh;

        return meshes;
    }

    addMany(...children) {
        /* Calls add() for every item given */
        return this.add(children)
    }

    append(item, mesh, options) {

        let v = [item, mesh, options];
        // give item index and child list reference
        let index = -1 + this.displayList.push(v);

        item._displayListIndex = index;
        item._displayListName = this.id;

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
            if(child[0].destroy){
                item = child[0].destroy();
            } else {
                child[1].dispose()
            }
        }
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
