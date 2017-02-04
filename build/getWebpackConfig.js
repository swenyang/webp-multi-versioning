module.exports = (isWebP) => {
    let pngLoaders
    if (isWebP) {
        pngLoaders = [
            'file-loader?name=[name].[hash].webp',
            'webp-loader?{quality: 100, lossless: true}',
        ]
    }
    else {
        pngLoaders = ['file-loader?name=[name].[hash].[ext]']
    }

    return {
        devtool: 'source-map',
        entry: './src/js/index.js',
        output: {
            path: './dist',
            filename: '[name].[hash].js',
        },
        bail: true,
        plugins: [],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['babel-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    ],
                },
                {
                    test: /\.(png)$/i,
                    loaders: pngLoaders,
                },
            ],
        },
    }
}
