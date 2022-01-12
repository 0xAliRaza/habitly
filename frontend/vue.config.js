module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/habitly/'
  : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
                      @import "@/styles/styles.scss";
                    `,
      },
    },
  },
  configureWebpack: {
    devServer: {
      port: 8080,
      watchOptions: {
        poll: true,
      },
    },
  },
};
