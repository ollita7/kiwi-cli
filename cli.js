#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var path = require('path');
var _ = require('lodash');

program
  .version('0.1.0')
  .arguments('[name]')
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

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function create(name, content, path) {
  ensureDirectoryExistence(name);
  fs.writeFile(name, content, function (err) {
    if (err) {
      return console.log(`${err}\nERROR: Some error ocurred trying to create file.`);
    }
    console.log("INFO: The file was created");
  });
}

function getName(name) {
  const path = name.split('/');
  if (path.length === 1) {
    return name;
  }
  return path.pop();
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

    content = _.replace(content, /{name}/g, getName(name));
    create(`${name}.controller.ts`, content);
    return;
  }
  if (program.middleware) {
    const typeValue = type === 'after' || type === 'a' ? 'After' : 'Before'
    let content = fs.readFileSync(`${__dirname}/templates/middleware.txt`);
    content = _.replace(content, '{name}', getName(name));
    content = _.replace(content, '{type}', typeValue);
    create(`${name}.middleware.${typeValue}.ts`, content);
    return;
  }
  if (program.build) {
    var result = require('child_process').execSync(`tsc`).toString();
    if(result !==''){
      console.log(result);  
    } else {
      console.log('INFO: build finished successfully');
    }
  }
  if (program.run) {
    var result = require('child_process').execSync(`tsc`).toString();
    result = require('child_process').execSync(`node ./dist/server.js`).toString();
    console.log(result);
  }
}
