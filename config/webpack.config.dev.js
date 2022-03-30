module.exports = {
  output: {
    filename: "scripts/[name].js", //生成多文件写法，加hash是防止浏览器缓存影响，
  },
  mode: "development",
  devtool: "inline-source-map", //编译后的代码溯源，更好追踪错误
  devServer: {
    static: "./dist", //webpack-dev-server的物理路径
  },
};
