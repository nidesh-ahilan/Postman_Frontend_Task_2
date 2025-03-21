import type { NextConfig } from "next";

const nextConfig: NextConfig = {
        output: "export",        // Enable static export
        basePath: "/Postman_Frontend_Task_2", // Set the base path for GitHub Pages
        trailingSlash: true,      // Add trailing slashes to URLs
};


export default nextConfig;
