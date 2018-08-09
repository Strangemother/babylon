Some elements for notation, later implementation.

1. Tree Shaking:

 Tree shaking top level modiles to omit for a build using compilation detection with callbacks on every top=level module during a 'shake-run'.

 A Shake run should perform every action you'd like to bake into the result. Using a unique component of the library once will flag its storage for the next stage of compliation.

