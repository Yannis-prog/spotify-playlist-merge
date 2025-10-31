import type { NextConfig } from "next";

// Validation: NEXT_PUBLIC_BACKEND_URL is required
if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
	throw new Error(
		'❌ NEXT_PUBLIC_BACKEND_URL environment variable is required. ' +
		'Set it in Render dashboard or .env file.'
	);
}

const nextConfig: NextConfig = {
	rewrites: async () => {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
			},
		];
	},
};

export default nextConfig;