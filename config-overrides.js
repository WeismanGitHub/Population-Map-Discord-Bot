const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appHtml = path.resolve(__dirname, 'src/client/public/index.html')
        paths.appIndexJs = path.resolve(__dirname, 'src/client/src/index.js')
        paths.appPublic = path.resolve(__dirname, 'src/client/public')
        paths.appBuild = path.resolve(__dirname, 'dist/client/build')
        paths.appSrc = path.resolve(__dirname, 'src/client/src')
        return paths;
    }
};