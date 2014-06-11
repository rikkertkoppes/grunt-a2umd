var a2umd = require('./a2umd.js');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
    grunt.registerMultiTask('a2umd', 'wraps an amd module to also behave in global scope using esprima', function() {
        var template = this.data.template||path.join(__dirname, '..', 'templates', 'wrapper.hbs');
        var options = this.options();

        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            src.forEach(function(fn) {
                try {
                    var src = grunt.file.read(fn);
                    var res = a2umd.parse(src);
                    if (!res.amdName) {
                        res.amdName = path.relative(options.baseUrl||'.',fn).replace(path.sep,'/');
                    }
                    var tpl = fs.readFileSync(template,'utf8');
                    res = a2umd.wrap(res,tpl);
                    grunt.file.write(f.dest,res);
                } catch (e) {
                    grunt.warn(fn + ': ' + e.message, 3);
                }
            });
        });
    });
};