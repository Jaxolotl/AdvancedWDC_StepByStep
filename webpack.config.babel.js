// import webpack from 'webpack';
import { resolve } from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { version, name } from './package.json';

const [MAJOR, MINOR, PATCH] = version.split('.');

export default {
    context: resolve('src'),
    entry: {
        main: ['babel-polyfill', './app.js']
    },
    devtool: 'cheap-module-source-map',
    output: {
        path: resolve(`dist/app/`),
        publicPath: `/app/`,
        filename: `${name}.js`
    },
    resolve: {
        extensions: ['.js']
    },
    stats: {
        colors: true,
        reasons: true,
        chunks: false
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader'
                }
            },
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader'
                },
                include: [
                    resolve('src'),
                    resolve('node_modules/@jaxolotl')
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'file-loader?limit=100000&name=assets/[hash].[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/']),
        new ProgressBarPlugin(),
        new MiniCssExtractPlugin({
            filename: `${name}.${MAJOR}.${MINOR}.${PATCH}.[name].css`,
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            template: `./index.html`,
            filename: `../index.html`,
            minify: false
        }),
        new InlineManifestWebpackPlugin()
    ]
};
