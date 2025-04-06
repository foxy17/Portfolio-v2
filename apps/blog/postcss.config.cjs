// Extend the shared PostCSS config
const sharedConfig = require('@portfolio/tailwind-config/postcss.config');

module.exports = {
  plugins: {
    ...sharedConfig.plugins,
    // You can add blog-specific PostCSS plugins here
  },
}; 