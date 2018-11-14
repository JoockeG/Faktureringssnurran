// Don't transpile node_modules for testing purposes unless its located in fortnox-frontend
require('babel-core/register')({
	ignore: /node_modules\/(?!fortnox-react)/
});
require('babel-polyfill');
require('./env.helper.js');
