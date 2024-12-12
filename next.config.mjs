import { buffer } from 'stream/consumers';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack:(config)=>{
  //   return config.externals.push({
  //     "utf-8-validate":"commonjs utf-8-validate",
  //     bufferutil:"commonjs bufferutil"

  //   });
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
    ],
    // domains:["uploadthing.com","utfs.io"]
  },
};

export default nextConfig;
