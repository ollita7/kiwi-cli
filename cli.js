#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var _ = require('lodash');

program
  .version('0.1.0')
  .arguments('<name>')
  .usage('kc [options] <name>')
  .option('-i, --init', 'creates initial sever', 'server.ts')
  .option('-c, --controller', 'creates a empty controller')
  .option('-m, --middleware <type>', 'creates a empty middleware')
  .option('-b, --build', 'Compile the typescript code')
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
    let content = fs.readFileSync(`${__dirname}/templates/server.txt`);
    create('server.ts', content);
    content = fs.readFileSync(`${__dirname}/templates/tsconfig.json`);
    create('tsconfig.json', content);
    return;
  }
  if (program.controller) {
    let content = fs.readFileSync(`${__dirname}/templates/controller.txt`);
    content = _.replace(content, /{name}/g, name);
    create(`${name}.controller.ts`, content);
    return;
  }
  if (program.middleware) {
    const typeValue = type === 'after' || type === 'a' ? 'After' : 'Before'
    let content = fs.readFileSync(`${__dirname}/templates/middleware.txt`);
    content = _.replace(content, '{name}', name);
    content = _.replace(content, '{type}', typeValue);
    create(`${name}.middleware.${typeValue}.ts`, content);
    return;
  }
  if (program.build) {
    var exec = require('child_process').exec;
    exec(`${__dirname}/tsc`, function callback(error, stdout, stderr) {
      if(error){
        console.log(error);
        return;
      }
      console.log('Compilation finished')
    });
  }
}
