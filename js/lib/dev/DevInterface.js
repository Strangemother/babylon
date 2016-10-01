
class DevInterface {

    constructor(gi){
        this.appData(gi);
        this.components = {};
        this.modules = {};

        this._slowLoaders = [];
    }


    /* Intergrates developer interface components with babylon */
    appData(intf) {
        /* apply and return the GameInterface instance */
        if(intf !== undefined) {
            this._appData = intf;
        };
        return this._appData
    }

    start(config){
        var c =  this.appData()
        if(c !== undefined){
            c = c.config;
        }

        this.config = config || c || {};
        this.templated = new Templated(this.config);
        this.templated.start();
        this.create(this.config.grid)
        this.load(this.config.components)
    }

    defaults(){
        return {
            widget_margins: [10,10]
            , widget_base_dimensions: [50, 50]
        }
    }

    create(config){
        var config = Object.assign(this.defaults(), config);

        this.gridster = $('.gridster ul').gridster(config);
        // Yuk right?
        this.api = this.gridster.gridster().data('gridster');
    }

    load(components) {
        /* load the components. Give an object, a new
        loader is create and calls each key in the object.*/
        var loader = new Loader()
        for(var name in components) {
            var item = components[name];
            var func = (function(){

                var self = this.self;
                var config = this.item
                return function(asset, html){
                    /* loader callback */
                    return self.loadHandler({ asset, html, config })
                }

            }).apply({
                self: this
                , item: item
            });

            loader.load(name, func);
        }
    }

    loadHandler(data) {
        /* handler for the load call for component*/
        this.components[data.asset.name] = Object.assign(data, {
            klass: Components._register[data.asset.name]
            , name: data.asset.name
        });

        // console.log('Loaded component', this.components);
        this.slowLoad(data.asset.name)
    }

    slowLoad(name) {
        // load slowly
        if(this.inLoad) {
            this._slowLoaders.push(name);
        } else {
            var module = this.makeComponent(this.components[name]);
            this.loadModule(module);
            this.inLoad = true;

            window.setTimeout(function(parent){
                parent.inLoad = false;
                name =parent._slowLoaders.shift();
                name && parent.slowLoad(name);
            }, 500, this);
        }

    }

    baseCell(name){
        var c = {
            html: 'content'
            , name: name || 'name'
            , klass: Component
            , config: {
                enabled: true
                , width: 1
                , height: 1
                , col: 1
                , row: 1
                , max: undefined
                , min: undefined
                // , callback: this.addCellCallback
            }
        }

        return this.makeComponent(c);
    }

    makeComponent(component) {
        var app = this;
        var cell = this.createCell(component.html);
        var view = this.addCell(cell, component);
        var instance = this.createInstance(view, component);
        var module = { view, instance, component, app };
        return module;
    }

    addCell(cell, component) {

        /*
         {String|HTMLElement} html The string representing the HTML of the widget
          or the HTMLElement.
         {Number} [size_x] The nº of rows the widget occupies horizontally.
         {Number} [size_y] The nº of columns the widget occupies vertically.
         {Number} [col] The column the widget should start in.
         {Number} [row] The row the widget should start in.
         {Array} [max_size] max_size Maximun size (in units) for width and height.
         {Array} [min_size] min_size Minimum size (in units) for width and height.
         {Function} [callback] Function executed after the widget is shown.

         @return {HTMLElement} Returns the jQuery wrapped HTMLElement representing.
          the widget that was just created.

          fn.add_widget = function (html, size_x, size_y, col, row, max_size, min_size, callback)
         */
        var config = {
            enabled: true
            , width: 1
            , height: 1
            , col: 1
            , row: 1
            , max: undefined
            , min: undefined
            // , callback: this.addCellCallback
        }

        config = Object.assign(config, component.config)


        var self = this;

        if(config.callback !== undefined){
            // Reassign the user applied callback.
            config._callback = config.callback;
            config.callback = (function(){
                /* closed scope function wrapper ensuring async calls
                don't get all muddled up. */
                var self = this.self
                    , config = this.config
                    , component = this.component
                    ;

                return function(){
                    /* Caller for the Gridster.add_widget callback */
                    return self.addCellCallback(this, config, component);
                };

            }).apply({
                config, component, self
            })
        }

        if(config.enabled == false) {
            console.info(`${component.name} component is not enabled`)
            return config
        };

        // this.addQueue({
        //     func: this.api.add_widget
        //     , args: [
        //         cell
        //         , config.width
        //         , config.height
        //         , config.col
        //         , config.row
        //         , config.max
        //         , config.min
        //         , config.callback
        //     ]
        // });

        var view = this.api.add_widget(cell
            , config.width
            , config.height
            , config.col
            , config.row
            , config.max
            , config.min
            , config.callback
        );

        return view;
    }

    addCellCallback($widget, config, component) {
        console.log('add cell callback.', this, arguments);
        if( it(config._callback).is('function') ) {
            config._callback($widget, config, component);
        }
    }

    createInstance($widget, component) {
        console.log('Generate Cell', component.name);
        if(component.klass == undefined) {
            console.warn('class not registered for', component.name)
            return
        }
        var instance = new component.klass($widget);
        return instance;
    }

    createCell(html){
        /* Make a jquery DOM item for appending to the gridster API*/
        let random = Math.random().toString(32).slice(2);
        html = html || 'content';
        var cell = $('<li/>', {
            id: `cell${random}`
            , html: html
        });

        return cell;
    }

    loadModule(module) {
        var name = module.component.name;
        if(this.modules[name] == undefined) {
            this.modules[name] = [];
        };

        if(module.data == undefined) {
            module.data = {};
        }

        this.modules[name].push(module);

        this.templated.add(module.view);
        if(module.view.enabled !== false){
            module.binding = rivets.bind( module.view, module.data );

        };

        if(module.instance) {

            module.instance._viewCache = module.instance.viewPosition(module.view)
            module.data.view = module.instance._viewCache
            module.data.module = module.instance
            module.instance.module = module;
        };

        return module;
    }
}


class Component {
    /* A view implementation for managing dev objects */

    constructor(element){
        this._view = element;
        this._events = {};
        this._name = undefined;
        this._viewCache = {};
        this._tick = 0;
        this.data = {};

        var events = this.makeEvents();

        this.init(this._view)
    }

    init(element){}

    makeEvents(){
        document.body.addEventListener('mouseup', this.mouseupEvent.bind(this), true);

        var d =  Object.assign(this.requiredEvents(), this.events())

        for(var name in d) {
            this.on(name, d[name].bind(this))
        }

        return d;

    }

    requiredEvents(){

        return {
            focusin: this.focusEvent
            , focusout: this.blurEvent
            , resizestop: this.resizestopEvent
            , resizing: this.resizingEvent
        }
    }

    events(){
        return {}
    }

    applyValues(){}
    updateData(){}

    mouseupEvent(e) {

        if(e.srcElement != undefined) {
            // react
            var el = e.srcElement;
            if(el.attributes.action == undefined) {
                el = e.srcElement.parentElement
            };


            if( el.attributes.action != undefined ) {
                var v = el.attributes.action.value

                if( it(this[v]).is('function') ) {
                    console.log('mouseup', this.name(), el);
                    return this[v](e, el);
                }
            }
        }
    }

    tick(){
        /* Cheap tick function. Every call raises the tick by 1.
        If the tick total is greater than the tick limit, the
        internal tick total is reset.

        If tick is 0; true is returned
        if tick is less than the tick limit; false is returned */
        this._tick++;
        if(this._tick < 10) { return false };
        this._tick = 0;

        return true
    }

    resizestopEvent(e) {
        // console.log('resize end', this)
        if( this.view()[0] == e.data.element[0]  ) {
            this.cachePosition()
        }
    }

    resizingEvent(e) {
        // console.log('resize end', this)
        if(!this.tick()) return;

        if( this.view()[0] == e.data.element[0]  ) {
            this.cachePosition()
        }
    }

    cachePosition(){
        console.log('caching', this.name())
        var vp = this.viewPosition();
        for(var key in vp) {
            if( this._viewCache[key] != vp[key] ) {
                this._viewCache[key] = vp[key]
            }
        }

    }

    focusEvent(e){
        // unbind

        if( this.inComponent(e.target) ) {
            //this.module.binding.unbind()
            this.unbound = true;
        } else if(this.unbound) {
            this.applyValues()
           // this.module.binding.update()
           // this.module.binding.bind()
            this.unbound = false;
        }
    }

    inComponent(htmlElement) {
        /* return boolean if the given HTML element is within
        this component.
        */
        var view = this.view()[0]
        return isDescendant(view, htmlElement);
    }

    blurEvent(e) {
        // this.applyValues(e)
        // console.log(e.target)
        if( this.unbound &&
            (this.inComponent(e.target) == false) ) {
                this.applyValues()
            }
        // send
        // rebind
    }

    on(name, func) {
        this._events[name] = func;
        window.addEventListener(name, this.eventReceiver.bind(this))
    }

    eventReceiver(e) {
        if(e.name == undefined && e.detail == 0) {
            // native event
            if(e.type in this._events) {
                return this._events[e.type](e);
            };
        };

        var o = Object.assign(e.detail, {event: e});
        if(this._events[e.detail.name] !== undefined) {
            this._events[e.detail.name](o);
        };
    }

    name(){
        /* return the name of the component.*/
        return this._name || this.constructor.name.toLowerCase()
    }

    view(){
        /* return an instance of the hooked view. */
        if(this._view == undefined) {
            this._view = this.getViewElements()
        };

        return this._view;
    }

    viewPosition(view){
        var cp = ( view || this.view() ).data().coords.grid;
        return {
            width: cp.size_x
            , height: cp.size_y
            , col: cp.col
            , row: cp.row
        }
    }

    getViewElements(){
        /* return the elements this component will target.*/
        var name = this.name()
        var $components = $(`component[name=${name}]`);
        return $components
    }
}


class Components {
    static register(name, Klass) {
        return Components._register[name] = Klass;
    }
}

Components._register = {};



class Loader {

    load(name, handler) {
        var files = ['main.js']
        var componentsPath = './js/lib/dev/components/';
        var self = this;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var path = `${componentsPath}${name}/${file}`;
            var obj = { name, files, path, componentsPath, handler};

            $.getScript(path, (function(){

                var obj = this;
                return function(data, state, request){
                    self.scriptHandler(data, state, request, obj);
                };
            }).apply(obj) );

        };

    }

    scriptHandler(data, start, request, obj) {
        /* script has loaded. Boot from the register whilst
        appending HTML to the dom.*/
        var self = this;
        $.get(`${obj.componentsPath}${obj.name}/view.html`, (function(data){
            var obj = this;
            return function(html, request){
                self.htmlHandler(obj, html, request);
            };
        }).apply(obj) )
    }

    htmlHandler(obj, html) {
        this.loaded(obj, html)
    }

    loaded(obj, html) {
        obj.handler(obj, html)
    }
}

rivets.configure({

  // Attribute prefix in templates
  prefix: 'rv',

  // Preload templates with initial data on bind
  preloadData: true,

  // Root sightglass interface for keypaths
  rootInterface: '.',

  // Template delimiters for text bindings
  templateDelimiters: ['{', '}'],

  // Augment the event handler of the on-* binder
  handler: function(target, event, binding) {
    this.call(target, event, binding.view.models)
  }

})


class DataArray extends Array {

    constructor(d) {
        super(d)
        this.init(d)
    }

    init(d) {

    }

    raw() {
        /* Return a native Array type from the internal dataset. */
        return this.slice.call([], 0)
    }

    static instance(d){
        /* return a new instance of the data array with
        the given data*/
        var d = new this.prototype.constructor(d || this.raw());
        return d;
    }
}

var DA = function(d){
    return DataArray.instance(d);
}


class HTMLArray extends DataArray {

    init(d){
        // debugger
    }

    findTag(tag) {
        /* return all child with the same tag within
        all children and its decendants
        Returned it an array of HTMLNodes */
        var funcName = 'childNodes';
        var elements = [];

        var eachTag = function(item, key, data) {
            console.log('children', item.childElementCount);
            
            if( item.childElementCount == undefined) return;
            
            if( item.tagName && item.tagName.toLowerCase() == tag.toLowerCase() ) {
                elements.push(item);
            };

            return item[funcName] && item[funcName].forEach(eachTag)
        }

        var r = this.every(eachTag, this);
        console.log(r)
        return elements;
    }
}


var HA = function(d){
    return HTMLArray.instance(d);
}


class DomCreator {

    constructor(HTMLNode) {
        this.element = HTMLNode || document.body;
    }

    def(){
        return {
            css: this.cssElement
        }
    }

    find(type) {
        /* find the dom type eithin the parent element*/
        var dom = HA(this.element);
        var els = dom.findTag(type);

        return els;
    }
}

class Templated {

    constructor(def) {
        this.def = def;
        this.templates = {};
        if(this.def != undefined) {
            this.start(this.def)
        }

    }

    defaults(){
        return {
            tag: 'templated'
            , assigns: {
                button: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'
                , config: 'mdl-button mdl-js-button mdl-button--icon mdl-button--colored'
            }
            , templates: {}
        }
    }

    set def(v) {
        this._def = v;
    }

    get def(){
        return this._def;
    }

    start(def, parent){

        var config = Object.assign(this.defaults(), def);
        // console.log('capture', config);

        if(config.debug) {
            // console.log('debug mode')
        };

        if(config.enabled !== false) {
            this.hook(config.tag, config, parent)
        };

        this.config = config;

    }

    add(parent) {
        /* Add live applied attributes to the templating scope. Applying
        templates and storing.*/
        return this.start(this.def, parent);
    }

    destroy(){
        this.unhook(this.config.tag, this.config)
    }

    hook(name, config, $p) {
        var $parent = $p || $
        if($parent.find === undefined) {
            return false;
        };

        var $items = $parent.find(`[${name}]`);
        for (var i = 0; i < $items.length; i++) {
            this.applyValues($items[i], config)
        }

        var $items = $parent.find(`value`);
        this.makeValues($items)
    }

    makeValues($items) {
        for (var i = 0; i < $items.length; i++) {
            var node = $items[i];
            var attr = 'module.value';

            if( node.hasAttribute('data-converted')
                && node.getAttribute('data-converted') == true ) {
                continue;
            }

            if(node.hasAttribute('value')) {
                attr = node.attributes.getNamedItem('value')
            }

            if(node.attributes.length == 1) {
                if( node.attributes[0].nodeValue == '') {
                    attr = node.attributes[0].nodeName;
                }
            }

            node.setAttribute('rv-text', attr)
            node.setAttribute('data-converted', true)
        }
    }

    unhook(name, config) {
        var $items = $(`[${name}]`);
        for (var i = 0; i < $items.length; i++) {
            this.removeValues($items[i], config)
        }
    }

    applyValues(element, config){
        // console.log('hooking element', element);
        var res = []
        var nodeType = element.nodeName.toLowerCase();
        var _type = nodeType;

        config = config || {};
        var t = element.attributes.templated.value;
        if(t != '') {
            // config inline
            var tt = t.split(':');
            _type = tt[0];
            if(tt.length == 1) {
                if( this.templates[nodeType] !== undefined
                    && this.templates[nodeType][_type] !== undefined ) {
                    var _t = this.templates[nodeType][_type];
                    res.push( this.applyTemplate(element, _t, config) )
                    // replace/
                }
            }else{
                if(this.templates[_type] === undefined) {
                    this.templates[_type] = {};
                };

                this.templates[_type][tt[1]] = { type: tt[0], template: tt[1], element: element };
            }

        };

        if(_type in config.assigns) {
            this.applyElement(element, config.assigns[_type])
        }

        return res;
    }

    removeValues(element, config){
        debugger;
        var _type = element.nodeName.toLowerCase();
        if(_type in config.assigns) {
            this.removeElement(element, config.assigns[_type])
        }
    }

    applyElement(element, config) {
        if( it(config).is('string') ) {
            return this.addClasses(element, config)
        }
    }

    applyTemplate(element, templateObject, config) {
        // Copy anything from the element,
        // append template to parent of element.
        var repl = this.replicateElement(element, templateObject);

        this.templateElement(repl, templateObject, config);

        // Replace element with new element
        element.parentElement.replaceChild(repl.current, element);

        // Materialize lite
        componentHandler.upgradeDom()
        return repl.current
    }

    replicateElement(element, template) {
        var node = template.element.cloneNode(true);
        // Make a valid template. Replacing any values.
        node.id = element.id || this.random();
        node.value = element.value;
        return {
            template: template
            , current: node
            , removed: element
        }
    }

    templateElement(replicants, templateObject, config) {
        /* edit the node item to facilitate a ready dom object. */
        // debugger;
        if(replicants.current.dataset.upgraded != undefined) {
            delete replicants.current.dataset.upgraded
        };

        var $receiver = $(replicants.current).find('[receiver]');
        if($receiver.length > 0) {
            for (var i = 0; i < $receiver.length; i++) {
                // clone to receiver
                cloneAttributes($receiver[i], replicants.removed);
            };
        } else {
            // clone to template root
            cloneAttributes(replicants.current, replicants.removed);
        };
    }

    removeElement(element, config) {
        if( it(config).is('string') ) {
            return this.removeClasses(element, config)
        }
    }

    addClasses(element, string) {
        return $(element).addClass(string)
    }

    removeClasses(element, string) {
        return $(element).removeClass(string)
    }

    random(){
        return Math.random().toString(32).slice(2);
    }
}

function cloneAttributes(receiverElement, sourceNode) {
    let attr;
    let attributes = Array.prototype.slice.call(sourceNode.attributes);
    while(attr = attributes.pop()) {
        receiverElement.setAttribute(attr.nodeName, attr.nodeValue);
    }
}


var isDescendant = function(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}


var dispatchNativeEvent = function(name, data){
    var event = new CustomEvent(name, {
        detail: {
            data
            , name: name
        }
    });

    window.dispatchEvent(event)
};
