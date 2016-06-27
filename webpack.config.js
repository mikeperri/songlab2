var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: [ 'react-hot' ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.jsx?$/,
                loaders: [ 'babel' ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                loaders: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'SongLab'
        })
    ]
}
