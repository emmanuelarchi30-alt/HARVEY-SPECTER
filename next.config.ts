import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/panel/dashboard",
        permanent: false,
      },
      {
        source: "/clientes",
        destination: "/panel/clientes",
        permanent: false,
      },
      {
        source: "/casos",
        destination: "/panel/casos",
        permanent: false,
      },
      {
        source: "/abogados",
        destination: "/panel/abogados",
        permanent: false,
      },
      {
        source: "/register-cliente",
        destination: "/registro-cliente",
        permanent: false,
      },
      {
        source: "/consulta-caso",
        destination: "/consultar-caso",
        permanent: false,
      },
      {
        source: "/consulta",
        destination: "/consultar-caso",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
