#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var _ = require('lodash');

program
  .version('0.1.0')
  .arguments('<name>')
  .option('-i, --init', 'creates initial sever', 'server.ts')
  .option('-c, --controller', 'creates a empty controller')
  .option('-m, --middleware <type>', 'creates a empty controller')
  .action(function (name, options) {
    var type = options.middleware;
    execute(name, type);
  })
  .parse(process.argv);

function create(name, content) {
  fs.writeFile(name, content, function (err) {
    if (err) {
      return console.log(`${err}\nERROR: Some error ocurred trying to create file.`);
    }
    console.log("INFO: The file was created");
  });
}

function execute(name, type) {
  if (program.init) {
    const content = fs.readFileSync('templates/server.txt');
    create('server.ts', content);
    return;
  }
  if (program.controller) {
    let content = fs.readFileSync('templates/controller.txt');
    content = _.replace(content, /{name}/g, name);
    create(`${name}.controller.ts`, content);
    return;
  }
  if (program.middleware) {
    const typeValue = type === 'after' || type === 'a' ? 'After' : 'Before'
    let content = fs.readFileSync('templates/middleware.txt');
    content = _.replace(content, '{name}', name);
    content = _.replace(content, '{type}', typeValue);
    create(`${name}.middleware.${typeValue}.ts`, content);
    return;
  }
}
