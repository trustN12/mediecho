
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mediecho.in' }],
        destination: 'https://mediecho.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
