const PRODUCTION = process.env.NODE_ENV === 'production';
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rootPath = __dirname + '/../';
const extract = Boolean(process.env.TRANS_EXTRACT);
const locale = process.env.TRANS_LOCALE;
const LessHintPlugin = require('lesshint-webpack-plugin');
const c3po = {};
const brandingDiscovery = require('frontend-branding/branding-discovery.js');

const branding = Boolean(process.env.BRANDING);
let brandingRegexValue = '*fortnox';
if (branding) {
	brandingRegexValue = '*';
}
const brandingRegex = new RegExp(`branding(/|\).${brandingRegexValue}.config`);

if (extract) {
	c3po.extract = {
		output: 'i18n/translations.pot',
		location: 'file'
	};
}

if (locale) {
	c3po.resolve = { translations: `i18n/${locale}.po` };
}

const autoprefixerOptions = {
	browsers: [
		'>1%',
		'last 4 versions',
		'Firefox ESR',
		'ie > 10'
	]
};

module.exports = {
	entry: {
		boot: ['babel-polyfill', 'whatwg-fetch', './node_modules/fortnox-react/src/utils/InjectApp.js'],
		app: [path.join(rootPath, 'src/app.jsx')]
	},
	output: {
		path: path.join(rootPath, './build'),
		//Default source language is swedish
		filename: locale ? `template.${locale}.js` : 'template.sv_SE.js',
		publicPath: PRODUCTION ? '' : '/build/'
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.jsx$|.js$/,
				loader: "eslint-loader",
				exclude: /node_modules/
			},
			{
				test: /\.jsx$|.js$/,
				loader: 'babel-loader',
				options: {
					plugins: [['c-3po', c3po]]
				},
				include: [
					path.join(rootPath, './src'),
					path.join(rootPath, 'node_modules/fortnox-react/src')
				]
			},
			{
				test: /backbone\.js$/,
				loader: 'imports-loader',
				options: {
					define: '>false'
				}
			},
			{
				test: /branding\/.*\.js/,
				oneOf: [
					{
						test: brandingRegex,
						use: [
							{
								loader: 'file-loader',
								query: {
									name: 'config.[1].js',
									regExp: /([a-z]+)\.config\.js$/
								}
							}
						]
					},
					{
						test: /branding\/.*.js/,
						use: 'null-loader'
					}
				]
			},
			{
				test: /branding\/.*\.less/,
				oneOf: [
					{
						test: brandingRegex,
						use: [
							{
								loader: 'file-loader',
								query: {
									name: 'template.[1].css',
									regExp: /([a-z]+)\.config\.less$/
								}
							},
							'extract-loader',
							{
								loader: 'css-loader',
								options: {
									importLoaders: 1,
									minimize: PRODUCTION,
									sourceMap: !PRODUCTION
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss',
									plugins: () => [autoprefixer(autoprefixerOptions)],
									sourceMap: PRODUCTION ? false : 'inline'
								}
							},
							{
								loader: 'less-loader', options: {
								sourceMap: !PRODUCTION,
								paths: [
									path.resolve(__dirname, '../style')
								]
							}
							},
							{
								loader: 'prepend-loader',
								options: {
									data: "@import 'style.less';\n"
								}
							}
						]
					},
					{
						test: /branding\/.*.less/,
						use: 'null-loader'
					}
				]
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader'
			}, // inline base64 URLs for <=8k images, direct URLs for the rest
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader',
				options: {
					limit: 1000,
					minetype: 'application/font-woff'
				}
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader'
			}
		]
	},
	devtool: PRODUCTION ? false : 'source-map',
	resolve: {
		modules: [
			'node_modules',
			path.resolve(rootPath),
			path.join(rootPath, 'src/')
		],
		extensions: ['.js', '.json', '.jsx']
	},
	plugins: PRODUCTION ?

		/**
		 +---------------------------------------------+
		 | PRODUCTION PLUGINS                          |
		 +---------------------------------------------+
		*/

		[
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production'),
					'TRANS_LOCALE': JSON.stringify(process.env.TRANS_LOCALE)
				},
				BRANDINGS: brandingDiscovery()
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'boot',
				filename: 'template-boot.js'
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					screw_ie8: true, // React doesn't support IE8
					warnings: false
				},
				mangle: {
					screw_ie8: true
				},
			}),
			new ExtractTextPlugin('style.css'),
			new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|se/),
			new webpack.IgnorePlugin(/^jquery$/)
		] :

		/**
		 +---------------------------------------------+
		 | DEVELOPMENT PLUGINS                         |
		 +---------------------------------------------+
		*/

		[
			new webpack.IgnorePlugin(/^jquery$/),
			new webpack.NoEmitOnErrorsPlugin(),
			new WebpackNotifierPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					'TRANS_LOCALE': JSON.stringify(process.env.TRANS_LOCALE)
				},
				BRANDINGS: brandingDiscovery()
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'boot',
				filename: 'template-boot.js'
			}),
			new LessHintPlugin({
				files: [
					'./style/**/*.less',
					'!./style/vendor/*'
				]
			})
		]
};
