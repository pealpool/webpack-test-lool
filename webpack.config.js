const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const toml = require("toml");
const yaml = require("yaml");
const json5 = require("json5");

module.exports = (env) => {
    return {
        //entry: "./src/index.js", //入口文件，单入口写法
        /* 普通多入口写法，会有重复代码各自重复打包
                  entry: {
                      index:'./src/index.js',
                      another:'./src/another-module.js',
                  },*/
        /* 手动抽离重复包
                  entry: {
                      index:{
                          import: './src/index.js',
                          dependOn: 'shared',        //所依赖的公用模块叫xxx
                      },
                      another:{
                          import: './src/another-module.js',
                          dependOn: 'shared',
                      },
                      shared: 'lodash', //自定义哪个模块为公用模块，例如lodash
                  },*/
        entry: {
            index: "./src/index.js",
            another: "./src/another-module.js",
        },
        output: {
            //filename: "bundle.js", //打包后文件名，生成单文件写法
            filename: "scripts/[name].[contenthash].js", //生成多文件写法，加hash是防止浏览器缓存影响，
            path: path.resolve(__dirname, "./dist"), //必须是写绝对路径，所以引入path来获取当前目录的绝对路径，在根据绝对路径找dist
            clean: true, //每次打包先清空dist文件
            //output.assetModuleFilename是资源模块总的出口
            assetModuleFilename: "images/[contenthash][ext]", //contenthash是根据内容生产哈希值作为文件名，[ext]是按原本的后续名
            publicPath: "http://localhost:8080/",
        },
        // mode: "development", //开发模式 development，生产模式 production
        //配合命令 npx webpack --env production --env goal=local ,用命令行直接控制是开发环境还是生产环境，不用每次改这个webpack.config.js文件
        mode: env.production ? "production" : "development",
        devtool: "cheap-module-source-map", //编译后的代码溯源，更好追踪错误
        plugins: [
            //插件
            new HtmlWebpackPlugin({
                template: "./index.html", //找模板文件
                filename: "index.html", //打包后文件名
                inject: "body", //<script>标签注入到哪，不写就默认head
            }),
            new MiniCssExtractPlugin({
                filename: "style/[contenthash].css", //定义抽离的css缩放文件路径
            }),
        ],
        devServer: {
            static: path.resolve(__dirname, "./dist"), //webpack-dev-server的物理路径
            compress: true,  //gzip代码压缩
            port: 3000,   //指定端口号
            header: {  //添加响应头
                "X-Access-Token": "abc123",
            },
            hot: true,  //模块热替换，新版默认开启，不用再写
            liveReload: true, //热加载，新版默认开启，不用再写
            host: '0.0.0.0', //让局域网小伙伴用ip来链接
            proxy: {  //代理，配合自己写server.js解决开发环境跨域问题，生产环境不解决。
                '/api': 'http://localhost:9000'
            },
            // historyApiFallback: true, //解决SPA(单应用)把路由当静态资源去请求的问题
            historyApiFallback: {  //或手动指定不同路径所对应的页面
                rewrites: [
                    // { from: /^\/$/, to: '/views/landing.html' },
                    // { from: /^\/subpage/, to: '/views/subpage.html' },
                    {from: /./, to: '/views/404.html'},
                ]
            },
            client: {
                overlay: false, //eslint查到错误是，是否在浏览器也来个遮罩提示。
            }
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
            minimizer: [
                //生产环境才起作用
                new CssMinimizerPlugin(), //压缩css，
                new TerserPlugin(), //压缩js
            ],
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
        performance: {
            hints: false,  //禁用性能提示，一般别禁用
        },
    };
};
