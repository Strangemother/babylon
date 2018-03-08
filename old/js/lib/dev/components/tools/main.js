class ToolsComponent extends Component {
    addCell(){
        console.log('addCell')
        this.module.app.baseCell()
    }

    removeCell(){
        console.log('removeCell')
    }
}

Components.register('tools', ToolsComponent)
