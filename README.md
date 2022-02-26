[![npm][npm]][npm-url]

<div align="center">
  <h1>Insert Source Webpack Plugin</h1>
  <p>Insert script or link to your HTML </p>
</div>


<h2 align="center">Install</h2>

```bash
  npm i --save-dev insert-source-webpack-plugin
```

```bash
  yarn add --dev insert-source-webpack-plugin
```

<h2 align="center">Usage</h2>

It must be used before `html-webpack-plugin`

**webpack.config.js**

```js
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const InsertSourceWebpackPlugin = require("insert-source-webpack-plugin");

module.exports = {
  entry: {
    index: path.resolve(__dirname, "./src/index.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[contenthash:8].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          // react
          from: "node_modules/react/umd/react.production.min.js",
          to: `common/[name].[contenthash:8][ext]`,
        },
        {
          // react-dom
          from: "node_modules/react-dom/umd/react-dom.production.min.js",
          to: "common/[name].[contenthash:8][ext]",
        },
      ],
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new InsertSourceWebpackPlugin({
      replaceDomain: 'https://xxx.com',
    }),
  ],
};
```
In template HTML you need write `<script></script>`, because `insert-webpack-plugin` will find it and replace it with generated result

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <script></script>
  </head>
  <body></body>
</html>

```

This will generate a file `dist/index.html` containing the following

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <script
      defer
      src="https://xxx.com/common/react.production.min.356d96cc.js"
    ></script>
    <script
      defer
      src="https://xxx.com/common/react-dom.production.min.53ffa649.js"
    ></script>
    <script defer src="index.f61edb87.js"></script>
  </head>
  <body></body>
</html>
```

[npm]: https://img.shields.io/badge/npm-8.1.2-blue
[npm-url]: https://npmjs.com/package/insert-source-webpack-plugin
