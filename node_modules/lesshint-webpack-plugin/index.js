var LessHint = require('lesshint').Lesshint;
var glob = require('glob-all');
var arrify = require('arrify');
function LessHintPlugin(options) {
	this.options = options || {};
	this.lessOptions = options.configFile ? require(options.configFile) : null;
}

LessHintPlugin.prototype.apply = function (compiler) {
	var self = this;
	compiler.plugin('done', function () {
		var lessConfig = self.lessOptions;
		var lessHint = new LessHint();
		if (!lessConfig) {
			lessConfig = lessHint.getConfig();
		}
		lessHint.configure(lessConfig);
		var reporter = self.options.reporter || require('lesshint-reporter-stylish');
		glob(self.options.files || [], function (err, files) {
			if (err) {
				throw new Error('Error processing files');
			}
			for (var i = 0, iLen = files.length; i < iLen; i++) {
				lessHint.checkFile(files[i]).then((report) => {
					reporter.report(report);
			});
			}
		});
	});
};

module.exports = LessHintPlugin;
