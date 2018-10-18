var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var kiwiconsole = require('./kiwiconsole');

const src_path = 'src';

exports.executeInit = function () {
    try {
        let content = fs.readFileSync(`${__dirname}/templates/server.txt`);
        create(`${src_path}/server.ts`, content);
        content = fs.readFileSync(`${__dirname}/templates/tsconfig.json`);
        create('tsconfig.json', content);
        content = fs.readFileSync(`${__dirname}/templates/environments/environment.txt`);
        create('environments/environment.ts', content);
        content = fs.readFileSync(`${__dirname}/templates/environments/environment.prod.txt`);
        create('environments/environment.prod.ts', content);
        kiwiconsole.success('Server created.');
    }
    catch (ex) {
        kiwiconsole.error('Some error ocurred');
    }
}

exports.executeController = function (name) {
    try {
        if (addController(name)) {
            let content = fs.readFileSync(`${__dirname}/templates/controller.txt`);
            content = _.replace(content, /{name}/g, getName(name));
            create(`${src_path}/${name}.controller.ts`, content);
            kiwiconsole.success('Controller created.');
        }
    }
    catch (ex) {
        console.log(ex);
        kiwiconsole.error('Some error ocurred');
    }

}

exports.executeMiddleware = function (name, type) {
    try {
        const typeValue = type === 'after' || type === 'a' ? 'After' : 'Before'
        let content = fs.readFileSync(`${__dirname}/templates/middleware.txt`);
        content = _.replace(content, '{name}', getName(name));
        content = _.replace(content, /{type}/g, typeValue);
        create(`${src_path}/${name}.middleware.${_.lowerCase(typeValue)}.ts`, content);
        kiwiconsole.success('Middleware created.');
    }
    catch (ex) {
        kiwiconsole.error('Some error ocurred');
    }
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
    try {
        require('child_process').execSync(`tsc --project tsconfig.temp.json --outDir ${outDir}`).toString();
        if (env !== 'default') {
            renameFile(`${outDir}/environments/environment.${env}.js`, `${outDir}/environments/environment.js`);
        }
        removeFile('tsconfig.temp.json');
        kiwiconsole.success(`build for environment ${env} finished successfully`);
    }
    catch (error) {
        kiwiconsole.error(error.stdout.toString());
    }
}

function addController(name) {
    try {
        fs.statSync(`${src_path}/${name}.controller.ts`).isFile();
        kiwiconsole.error(`Controller ${getName(name)} already exist`);
        return false;
    }
    catch (ex) {
        
    }
    const file = fs.readFileSync(`${src_path}/server.ts`);
    const regex = /controllers: \[(.*?)\]/;
    controllers = regex.exec(file.toString())[1];
    const newControllers = controllers === '' ? `${getName(name)}Controller` : `${controllers}, ${getName(name)}Controller`;
    let newServer = _.replace(file.toString(), regex, `controllers: [${newControllers}]`);

    const importRegex = /^import (.*)$/gm;
    while (m = importRegex.exec(newServer)) {
        last = m;
    }
    if (!_.isNil(last)) {
        newServer = _.replace(newServer, last[0], `${last[0]}\nimport {${getName(name)}Controller} from './${name}.controller'`);
    }
    fs.writeFileSync(`${src_path}/server.ts`, newServer);
    return true;
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
