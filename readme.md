a2umd
=====

Converts an AMD module definition to an UMD one.

I like the umd wrappers like [grunt-umd](https://github.com/alexlawrence/grunt-umd), however, I don't like defining my dependencies in a gruntfile.

AMD is a nice way to define your dependencies. As a developer, I always just write AMD modules. As consumers of the modules don't necesarily use AMD, I want a wrapper to be able to use the modules globally.

a2umd converts amd style modules to umd style, using the same concepts as grunt-umd. Since the dependencies are already defined in the AMD style, there is no need to define them again.

So start with an AMD module:

    define(['pathA','pathB'],function GlobalName(a,b) {
        return {

        };
    });

And use the following grunt config:

    {
        'a2umd': {
            all: {
                files: [
                    src: 'src/foo.js',
                    dest: 'dest/foo.js'
                ]
            }
        }
    }

You will end up with a wrapped module:

    (function(root, factory) {
        if(typeof define === 'function' && define.amd) {
            define(['pathA','pathB'], factory);
        } else {
            root.GlobalName = factory(root.a,root.b);
        }
    }(this, function GlobalName() {
        return {

        };
    }));

Specific features
-----------------

- leaves the factory function exactly intact (plain copy)
- extracts dependency paths
- extracts local dependency names
- keeps AMD name if given (as first argument in the `define()`)
- use the factory function name as global name
- allows to define custom templates instead of the default one

Dependencies
------------

- [esprima](https://github.com/ariya/esprima): used for parsing the source file and extracting the relevant parts
- [handlebars](https://github.com/wycats/handlebars.js/): used as a template engine to create an UMD style module