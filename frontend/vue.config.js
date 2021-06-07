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
};
