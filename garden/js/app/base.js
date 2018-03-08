/*
The base application
 */


class Application {
    /* The garden applications hosts the interface and adaption to the
    rendering application. A user may extend this explicitly
    however it'd be cleaner to use the exposed App class. */

    run(entity, config){
        /* start a new application with the given config.
        the entity may be a string selector or canvas item.
        if one argument is given, config.element is used. */
        this.canvas = this.bindCanvas()
    }

    bindCanvas(entity, config){
        if(arguments.length == 1){
            config = entity;
            entity = config.element
        }

        if(it(entity).is('string')) {
            entity = document.getElementById(entity)
            if(entity == null) {
                entity = document.querySelector(name)
            }
        }


        if(entity == null) {
            console.warn('entity name cannot be found:', name)
            return undefined
        }

        if(config.size == SIZE.FULL){
            entity.classList.add('game-entity');
        } else if(config.size !== undefined) {
            entity.width = config.size[0]
            entity.height = config.size[1]
        };

        return entity
    }
}


class Garden {
    /* User extendable application designed for clean implementation
    of a Garden rendering host.*/

}
