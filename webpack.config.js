const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ['@babel/env'] }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
        path: path.resolve(__dirname, 'public/'),
        publicPath: '/public/',
        filename: 'bundle.js'
    }
};
