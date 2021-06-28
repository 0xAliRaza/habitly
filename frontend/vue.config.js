module.exports = {
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
