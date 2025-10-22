import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	rewrites: async () => {
		return [
			{
				source: "/api/:path*",
				destination: process.env.NEXT_PUBLIC_BACKEND_URL
					? `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
				: "http://localhost:3001/:path*",
			},
		];
	},
};

export default nextConfig;
