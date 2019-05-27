#!/usr/bin/env node

var program = require('commander');
var helper = require('./helper');

program
  .version('0.1.0')
  .usage('kc [command] <options>')

program
  .command('init')
  .description('creates an empty server')
  .action(helper.executeInit);

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

