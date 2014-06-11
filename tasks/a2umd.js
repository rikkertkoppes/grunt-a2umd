var esprima = require('esprima');
var assert = require('assert');
var handlebars = require('handlebars');

function parse(src,globalName) {
    var tree = esprima.parse(src,{
        loc: true,
        range: true
    });
    assert(tree.body.length == 1,'expected only one statement (define)');
    assert(tree.body[0].expression.callee.name == 'define','expected "define" as first and only call');

    var args = tree.body[0].expression.arguments;
    assert(args.length>=2,'expected at least 2 arguments in define');
    assert(args.length<=3,'expected at most 3 arguments in define');

    var amd = args[args.length-3];
    var deps = args[args.length-2];
    var factory = args[args.length-1];

    assert(deps.type=='ArrayExpression','expected an array of dependencies');
    assert(factory.type=='FunctionExpression','expected a factory function');

    var dependencyPaths = deps.elements.map(function(d) {
        return "'"+d.value+"'";
    });
    var dependencyNames = factory.params.map(function(d) {
        return 'root.'+d.name;
    });
    globalName = globalName || (factory.id && factory.id.name);
    var amdName = (amd && amd.value);

    var factorySrc = src.substring(factory.range[0],factory.range[1]);

    return {
        dependencyPaths: dependencyPaths,
        dependencyNames: dependencyNames,
        globalName: globalName,
        amdName: amdName,
        factorySrc: factorySrc
    };
}

function wrap(context,template) {
    var tpl = handlebars.compile(template);
    return tpl(context);
}

module.exports = {
    parse: parse,
    wrap: wrap
};
