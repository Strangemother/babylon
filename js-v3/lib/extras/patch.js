
class GardenPatch extends BaseClass {
    /* Mix many garden patches */
    $patchConfig(){
        /* Unique config for the patch. */
    }

    name(){
        return this.constructor.name
    }

    static name(){
        return this.name;
    }

    $config(){
        /* merged config for the global application. */
        return {

        }
    }

    static $preMount(app, index){
        /* Called upon discovery by the Garden.startCaller, before the $mount
        method */
        console.log('$preMount')
    }

    $mount(app){
        /* before init, after $premount*/
        console.log('$mount')
        this.$app = app; //Garden.instance()
        this.$children = this.$app.children;
    }

    $init(scene){
        /* first method to call */
    }

    $start() {
        /* Called by the garden instance when is ran.*/
        console.log("$start")
    }

    $afterStart() {
        /* Called by the garden instance after start is ran.*/
        console.log("$afterStart")
    }

    $destroy(){
        /* Called by the main garden instance when destorying the in instance
        app*/
    }

    get children(){
        console.warn('method "$children" should be called in a patch.')
        return this.$children;
    }

}
