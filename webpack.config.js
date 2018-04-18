const path = require('path');
const webpack = require('webpack');
const htmlWebpack = require('html-webpack-plugin');

module.exports = {
	entry: {
		script: './src/index.js',
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}	
			},
			{
				test:/\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new htmlWebpack({
			template: path.join(__dirname, 'src', 'index.html'),
			inject: 'body'
		})
	]
}