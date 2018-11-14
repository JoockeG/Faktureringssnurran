# Lesshint Plugin for Webpack

## Install

```console
$ npm install lesshint-webpack-plugin
```

## Usage

In your webpack configuration

```js
var LessHintPlugin = require('lesshint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new LessHintPlugin({
          files: [
              './source/applications/**/*.less',
              './source/frame/**/*.less',
              '!./source/frame/bootstrap/**/*.less',
              './source/modules/**/*.less',
              './source/layouts/**/*.less',
          ],
          configFile: path.resolve(__dirname, 'lesshint.json')
      })
  ],
  // ...
}
```

### Options

See [lesshint options](https://www.npmjs.com/package/lesshint#configuration), for the complete list of options.

* `configFile`: You can set the config file location for your lesshint options, remove to use .lesshintrc file
* `files`: You can set the glob pattern for finding files.
* `reporter`: You can set the reporter for lesshint. Default: `lesshint-reporter-stylish`
