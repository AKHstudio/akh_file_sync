import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    outputFileTracingRoot: path.join(__dirname),
    basePath: '/akh_file_sync',
};

export default nextConfig;
