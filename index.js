const pluginName = "InsertSourceWebpackPlugin";
const { Compilation } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class InsertSourceWebpackPlugin {
  constructor({ replaceDomain }) {
    this.replaceDomain = replaceDomain;
    this.assets = [];
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // 1.不能输出两次文件，所以要在HtmlWebpackPlugin转换好HTML以后，但是输出文件以前进行HTML的修改，然后通过回调传给HtmlWebpackPlugin。所以在配置插件的时候也需要配置在HtmlWebpackPlugin之后
      // 2. 找到指定的<script></script>标记替换
      // 3. react相关包必须在其他包以前引入
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName,
        (data, cb) => {
          const reg = /\<script\>\<\/script\>/;
          const fileData = data.html;
          const assetsKeys = Object.keys(this.assets);
          const commonReg = /common\/./;
          const endCssReg = /\.css$/;
          const endJsReg = /\.js$/;
          const reactReg = /(react)(?=\.)/;
          const reactDomReg = /(react-dom)/;
          let replaceContent = "";
          let newAssetsKeys = [];
          const reactAssetsKeysArr = [];
          assetsKeys.forEach((item) => {
            if (
              commonReg.test(item) &&
              (endJsReg.test(item) || endCssReg.test(item))
            ) {
              if (reactDomReg.test(item)) {
                reactAssetsKeysArr[1] = item;
              } else if (reactReg.test(item)) {
                reactAssetsKeysArr[0] = item;
              } else {
                newAssetsKeys.push(item);
              }
            }
          });
          newAssetsKeys = [...reactAssetsKeysArr, ...newAssetsKeys];
          newAssetsKeys.forEach((assetsKeyItem) => {
            if (endCssReg.test(assetsKeyItem)) {
              replaceContent += `<link href="${this.replaceDomain}${assetsKeyItem}" rel="stylesheet">`;
            } else if (endJsReg.test(assetsKeyItem)) {
              replaceContent += `<script defer src="${this.replaceDomain}${assetsKeyItem}"></script>`;
            }
          });
          const newFileData = fileData.replace(reg, replaceContent);
          data.html = newFileData;
          cb(null, data);
        }
      );
    });
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED,
        },
        (assets) => {
          this.assets = assets;
        }
      );
    });
  }
}

module.exports = InsertSourceWebpackPlugin;
