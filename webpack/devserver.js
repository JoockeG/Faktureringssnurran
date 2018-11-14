const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./config.js');
const listenPort = process.env.LISTEN_PORT || "9090";
const serveHTTPS = (process.env.PROTO || "https") == "https";
const WDSLocation = `${serveHTTPS ? "https" : "http"}://localhost:${listenPort}`;

config.entry.app.unshift(`webpack-dev-server/client?${WDSLocation}`, 'webpack/hot/dev-server');

function optionallyConfigureHTTPS(isHTTPS) {
	if(!isHTTPS) {
		return false;
	}
	return {
		spdy: {
			protocols: ['http/1.1'],
		},
	}
}

let server = new WebpackDevServer(webpack(config), {
	// webpack-dev-server options
	publicPath: '/build/',
	// Enable special support for Hot Module Replacement
	hot: true,
	https: optionallyConfigureHTTPS(serveHTTPS),
	// webpack-dev-middleware options
	quiet: false,
	noInfo: false,
	//Toggle what we want to see in the terminal console.
	stats: {
		colors: true,
		assets: true,
		version: true,
		hash: true,
		timings: true,
		chunks: true,
		chunkModules: true
	},
	proxy: require('./proxydef.js'),
	historyApiFallback: true
});

server.listen(listenPort, 'localhost', function () {
	console.log(`WDS Client location resolved to ${WDSLocation}`);
	console.log(`Devserver listening on port ${listenPort} using ${serveHTTPS ? "https" : "http"}`);
});
