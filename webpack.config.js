const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    externals: [],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: path.resolve(__dirname, 'aws-deploy'),
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        libraryTarget: 'commonjs2',
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const imports = [
                    '@nestjs/microservices',
                    '@nestjs/websockets/socket-module',
                    '@nestjs/microservices/microservices-module',
                    'class-validator',
                    'class-transformer'
                ];
                if (!imports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource, {
                        paths: [process.cwd()],
                    });
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
    ],
};
