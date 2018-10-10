var fs = require('fs');
var path = require('path');
var _ = require('lodash');

const src_path = 'src';

exports.executeInit = function () {
    let content = fs.readFileSync(`${__dirname}/templates/server.txt`);
    create(`${src_path}/server.ts`, content);
    content = fs.readFileSync(`${__dirname}/templates/tsconfig.json`);
    create('tsconfig.json', content);
    content = fs.readFileSync(`${__dirname}/templates/environments/environment.txt`);
    create('environments/environment.ts', content);
    content = fs.readFileSync(`${__dirname}/templates/environments/environment.prod.txt`);
    create('environments/environment.prod.ts', content);
}

exports.executeController = function (name) {
    let content = fs.readFileSync(`${__dirname}/templates/controller.txt`);
    content = _.replace(content, /{name}/g, getName(name));
    create(`${src_path}/${name}.controller.ts`, content);
}

exports.executeMiddleware = function (name, type) {
    const typeValue = type === 'after' || type === 'a' ? 'After' : 'Before'
    let content = fs.readFileSync(`${__dirname}/templates/middleware.txt`);
    content = _.replace(content, '{name}', getName(name));
    content = _.replace(content, '{type}', typeValue);
    create(`${src_path}/${name}.middleware.${typeValue}.ts`, content);
}

exports.executeBuild = function (env) {
    const extendedConfig = {
        extends: "./tsconfig.json",
        include: ['src/'],

    }
    let outDir = './dist';
    if (env !== undefined && env !== null && env != '') {
        extendedConfig.include.push(`environments/environment.${env}.ts`);
        outDir = `./dist/${env}`
    } else {
        env = 'default';
        outDir = `./dist/default`;
        extendedConfig.include.push(`environments/environment.ts`);
    }
    create('tsconfig.temp.json', Buffer.from(JSON.stringify(extendedConfig, null, 2)));
    var result = require('child_process').execSync(`tsc --project tsconfig.temp.json --outDir ${outDir}`).toString();
    if (result !== '') {
        console.log(result);
    } else {
        if (env !== 'default') {
            renameFile(`${outDir}/environments/environment.${env}.js`, `${outDir}/environments/environment.js`);
        }
        removeFile('tsconfig.temp.json');
        console.log(`INFO: build for environment ${env} finished successfully`);
    }
}

function renameFile(name, newName) {
    fs.renameSync(name, newName, function (err) {
        if (err) console.log('ERROR: ' + err);
    });
}

function removeFile(name) {
    fs.unlink(name, function (err) {
        if (err) return console.log(err);
    });
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function create(name, content) {
    ensureDirectoryExistence(name);
    fs.writeFileSync(name, content, function (err) {
        if (err) {
            return console.log(`${err}\nERROR: Some error ocurred trying to create file.`);
        }
        console.log(`INFO: The file ${name} was created`);
    });
}

function getName(name) {
    const path = name.split('/');
    if (path.length === 1) {
        return name;
    }
    return path.pop();
}
