CONFIG = {
    name: 'game-app'
    , asset_path: './assets/'
    , 'assets': [
        'house.3ds'
    ]
    // First level to apply
    , level: 'intro'
    // level name assocation
    , levels: {
        intro: IntroLevel
        , scaleTest: ScaleTestLevel
    }
    // name of the canvas to implement
    , canvasName: '#game_canvas'
    // Generic bg color
    , sceneColor: [.3,.3,0.6]
    // width height of the canvas
    , size: [800, 600]
    // , size: 'full' /*[800, 200]*/
    , colors: {
        red: [1,.4,.4]
        , green: [0.5, 1, 0.5]
        , brown: [0.8, .5, 0.5]
    }
    , camera: 'gamepadCam'
    , _camera: {
        type: 'gamepadCam'
        , position: [0, 5, -10]
    }

    // Developer editions
    , debug: true
    , components: {
        camera: {
            width: 10
            , height: 10
            , col: 1
            , row: 3
        }

        , buttons: {
            width: 10
            , height: 2
            , col: 1
            , row: 1
        }

        , config: {
            enabled: true
            , width: 14
            , height: 12
            , col: 12
            , row: 1
        }


        // , viewport: {
        //     width: 50
        //     , height: 30
        //     , col: 17
        //     , row: 1
        // }
    }

    , grid: {
        widget_base_dimensions: [10, 10]
        , resize: {
            enabled: true
            , axes: ['both']
            // handle_append_to: '',
            // handle_class: 'gs-resize-handle',
            // min_size: [1, 1]
            , stop: function(e, ui, $element) {
                console.log('stop Resize');
                dispatchNativeEvent('resizestop', {
                    event: e
                    , ui: ui
                    , element: $element
                })
            }

            , resize: function(e, ui, $element) {
                console.log('resize Resize');
                dispatchNativeEvent('resizing', {
                    event: e
                    , ui: ui
                    , element: $element
                })
            }
        }
        , draggable: {
            stop: function(){
                console.log('stop drag')
            }
        }
        , max_cols: 100
        , min_cols: 100
    }
}

var widget_defaults = {
    namespace: '',
    widget_selector: 'li',
    static_class: 'static',
    widget_margins: [10, 10],
    widget_base_dimensions: [400, 225],
    extra_rows: 0,
    extra_cols: 0,
    min_cols: 1,
    max_cols: Infinity,
    min_rows: 1,
    max_rows: 15,
    autogenerate_stylesheet: true,
    avoid_overlapped_widgets: true,
    auto_init: true,
    center_widgets: false,
    responsive_breakpoint: false,
    scroll_container: window,
    shift_larger_widgets_down: true,
    move_widgets_down_only: false,
    shift_widgets_up: true,
    show_element: function($el, callback) {
        if (callback) {
            $el.fadeIn(callback);
        } else {
            $el.fadeIn();
        }
    },
    hide_element: function($el, callback) {
        if (callback) {
            $el.fadeOut(callback);
        } else {
            $el.fadeOut();
        }
    },
    serialize_params: function($w, wgd) {
        return {
            col: wgd.col,
            row: wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y
        };
    },
    collision: {
        wait_for_mouseup: false
    },
    draggable: {
        items: '.gs-w:not(.static)',
        distance: 4,
        // ignore_dragging: Draggable.defaults.ignore_dragging.slice(0)
    },
    resize: {
        enabled: false,
        axes: ['both'],
        handle_append_to: '',
        handle_class: 'gs-resize-handle',
        max_size: [Infinity, Infinity],
        min_size: [1, 1]
    }
};
