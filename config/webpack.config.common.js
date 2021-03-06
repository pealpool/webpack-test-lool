const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const toml = require("toml");
const yaml = require("yaml");
const json5 = require("json5");

module.exports = {
  entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },
  output: {
    path: path.resolve(__dirname, "../dist"), //必须是写绝对路径，所以引入path来获取当前目录的绝对路径，在根据绝对路径找dist
    clean: true, //每次打包先清空dist文件
    assetModuleFilename: "images/[contenthash][ext]", //contenthash是根据内容生产哈希值作为文件名，[ext]是按原本的后续名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", //找模板文件
      filename: "index.html", //打包后文件名
      inject: "body", //<script>标签注入到哪，不写就默认head
    }),
    new MiniCssExtractPlugin({
      filename: "style/[contenthash].css", //定义抽离的css缩放文件路径
    }),
  ],
  module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset/resource", //资源处理方式：直接复制，并导出url。
        generator: {
          //output.assetModuleFilename是资源模块总的出口，rules.generator.filename可定义单独例外的出口
          filename: "images/[contenthash][ext]", //contenthash是根据内容生产哈希值作为文件名，[ext]是按原本的后续名
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline", //资源处理方式：转成Data，并导出url。
      },
      {
        test: /\.txt$/,
        type: "asset/source", //资源处理方式：导出源代码。
      },
      {
        test: /\.jpg$/,
        type: "asset", //自动判断，小于8kb文件，视为inline；否则视为resource。
        parser: {
          //一般不用设置了，默认8kb就很好
          dataUrlCondition: {
            maxSize: 4 * 1024 * 1024, //单位是kb，这里是4mb
          },
        },
      },
      {
        test: /\.(css|less)$/,
        //style-loader是将css代码以<style>...</style>放html的header里
        //css-loader是将css打包成webpack认识的js代码
        //use: ['style-loader', 'css-loader', 'less-loader'],
        //MiniCssExtractPlugin 将css单独生成一个文件并以链接方式<link rel="stylesheet" href="">放入html
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"], //加载顺序是从后往前
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource", //资源处理方式：直接复制，并导出url。
      },
      {
        test: /\.(csv|tsv)$/,
        use: "csv-loader", //csv会转成数组Array
      },
      {
        test: /\.xml$/,
        use: "xml-loader", //xml会转成js对象Object
      },
      {
        test: /\.toml$/,
        type: "json",
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/,
        type: "json",
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/,
        type: "json",
        parser: {
          parse: json5.parse,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, //排除这里面的js，是不需要ES6转ES5
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], //这包是配置好的预设，套用就好
            plugins: [
              [
                "@babel/plugin-transform-runtime", //处理await/async的插件
              ],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, //生效对象
          name: "vendors",
          chunks: "all", //自动把公共代码抽离到单独文件
        },
      },
    },
  },
};

