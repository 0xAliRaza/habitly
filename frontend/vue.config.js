module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
                      @import "@/styles/styles.scss";
                      @import "bootstrap/scss/bootstrap.scss";
                    `,
      },
    },
  },
};
