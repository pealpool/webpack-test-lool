const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", //入口文件
  output: {
    filename: "bundle.js", //打包后文件名
    path: path.resolve(__dirname, "./dist"), //必须是写绝对路径，所以引入path来获取当前目录的绝对路径，在根据绝对路径找dist
    clean: true, //每次打包先清空dist文件
    //output.assetModuleFilename是资源模块总的出口
    assetModuleFilename: "images/[contenthash][ext]", //contenthash是根据内容生产哈希值作为文件名，[ext]是按原本的后续名
  },
  mode: "development", //开发模式
  devtool: "inline-source-map", //编译后的代码溯源，更好追踪错误
  plugins: [
    //插件
    new HtmlWebpackPlugin({
      template: "./index.html", //找模板文件
      filename: "index.html", //打包后文件名
      inject: "body", //<script>标签注入到哪，不写就默认head
    }),
  ],
  devServer: {
    static: "./dist", //webpack-dev-server的物理路径
  },
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
    ],
  },
};
