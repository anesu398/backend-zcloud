const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development", // Set the mode to development
  // Entry point of the application
  entry: './src/index.js',

  // Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Ensures the 'dist' folder is cleaned before each build
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./src/index.html", // Ensure the correct path
    }),
],

  // Module resolution
  resolve: {
    fallback: {
      fs: false,
      net: false,
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      util: require.resolve('util'),
      process: require.resolve('process'),
      os: require.resolve("os-browserify/browser"),
      timers: require.resolve("timers-browserify"),
      tty: require.resolve("tty-browserify"),
      constants: require.resolve("constants-browserify"),
      https: require.resolve("https-browserify"),
      vm: require.resolve("vm-browserify"),
      "event-loop-stats": require.resolve("event-loop-stats"),
    v8: require.resolve("v8"),
    async_hooks: require.resolve("async_hooks"),
    child_process: false, // Disable unsupported module
      dns: false, // Optional: Use false for unsupported modules
      tls: false
    },
    extensions: ['.js', '.jsx'], // Automatically resolve these extensions
  },

  // Module rules for different file types
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Match JavaScript and JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Presets for modern JS and React
          },
        },
      },
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader'], // Loaders for handling CSS
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Match image files
        type: 'asset/resource', // Use Webpack's asset modules
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Match font files
        type: 'asset/resource', // Handle font files
      },
    ],
  },

  // Plugins to enhance Webpack functionality
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Template HTML file
      filename: 'index.html', // Output HTML file
      inject: 'body', // Inject scripts into the body
    }),
  ],

  // Development server configuration
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from the 'dist' folder
    compress: true, // Enable gzip compression
    port: 3000, // Specify the development server port
    open: true, // Open the browser automatically
    hot: true, // Enable hot module replacement
  },

  // Enable source maps for easier debugging
  devtool: 'source-map',
};
