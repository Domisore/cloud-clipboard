// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // process.env.NODE_ENV === 'development', // Always enable PWA for now
});

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'pclip.me',
            },
          ],
          destination: '/clipboard',
        },
        // Also support www.pclip.me just in case
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'www.pclip.me',
            },
          ],
          destination: '/clipboard',
        },
      ]
    };
  },
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/clipboard',
        permanent: true,
      },
    ];
  },
  webpack: (config: any, { dev }: { dev: boolean }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/public/sw.js',
          '**/public/workbox-*.js',
          '**/public/worker-*.js',
        ],
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
