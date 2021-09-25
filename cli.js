#!/usr/bin/env node

var program = require('commander');
var helper = require('./helper');

program
  .version('0.1.0')
  .usage('kc [command] <options>')

program
  .command('init')
  .option('-kc, --kiwicliversion', 'Specify the cli version')
  .option('-t, --typescriptversion', 'Specify the typescript version')
  .option('-tsn, --tsnodeversion', 'Specify the ts-node version')
  .option('-tnv, --typesnodeversion', 'Specify the @types/node version')
  .option('-kv, --kiwiserverversion', 'Specify the kiwi-server version')
  .option('-n, --name', 'Specify the name')
  .option('-p, --path', 'Specify the path')
  .description('creates an empty server')
  .action((options) => {
    helper.executeInit(options.kiwicliversion,options.typescriptversion,options.tsnodeversion,options.typesnodeversion,options.kiwiserverversion,options.name);
  });

program
  .command('controller <name>')
  .description('creates a empty [name] controller')
  .action((name) => {
    helper.executeController(name);
  });

program
  .command('middleware <name>')
  .option("-t, --type <type>", "Please specify the type <before|after>")
  .description('creates a empty middleware')
  .action((name, options) => {
    helper.executeMiddleware(name, options.type);
  });

program
  .command('build')
  .option("-e, --env <env>", "Please specify the environment")
  .option("-w, --watch", "Watch for changes in source code")
  .description('Build your code')
  .action((options) => {
    helper.executeBuild(options.env, options.watch);
  });

program.parse(process.argv);

