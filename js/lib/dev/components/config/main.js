class ConfigComponent extends Component {

    events(){
        return {
            configure: this.configureEvent
        }
    }

    configureEvent(e){
        console.log('bind config', e)
        var p = e.data._viewCache
        this.item = {
            name: e.data.name
            , width: p.width
            , height: p.height
            , col: p.col
            , row: p.row
        }
    }
}


Components.register('config', ConfigComponent)
