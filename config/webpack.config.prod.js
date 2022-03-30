const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  output: {
    filename: "scripts/[name].[contenthash].js", //生成多文件写法，加hash是防止浏览器缓存影响，
    publicPath: "http://localhost:8080/",
  },
  mode: "production" ,
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), //压缩css，
      new TerserPlugin(), //压缩js
    ],
  },
};
