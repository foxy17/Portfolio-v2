/** @type {import('next').NextConfig} */
const cspBuilder = require('content-security-policy-builder');
const cspHeaders = require('./config/cspHeaders');
const { withContentlayer } = require('next-contentlayer')

const cspConfig = cspBuilder(cspHeaders);

const rewrites = async () => [
  {
    destination: 'https://cdn.splitbee.io/sb.js',
    source: '/sb.js'
  },
  {
    destination: 'https://hive.splitbee.io/:slug',
    source: '/sb-api/:slug'
  }
];


module.exports = withContentlayer({
  rewrites,
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    browsersListForSwc: true,
  },
  webpack: function (config, { isServer }) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
});

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: `Content-Security-Policy${cspConfig.reportOnly ? '-Report-Only' : ''}`,
    value: cspConfig,
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  // Opt-out of Google FLoC: https://amifloced.org/
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];
