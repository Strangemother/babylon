# An Application

An `Application` class extends the `RenderLoop`. The contructor or the `run` method may accept the init parameters to structure your interface

    app = new Application
    app.run('my_canvas', {})


Same as:

    app = new Application('my_canvas', {})
    app.run()


The init parameters provide the unchanging application variables such as the canvas size and other start properties.
