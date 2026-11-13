module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    cssnano:
      process.env.NODE_ENV === 'production'
        ? {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          }
        : false,
  },
};
