import * as esbuild from "esbuild-wasm";

// onResolve -> onLoad

const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    // bundling process - build
    setup(build: esbuild.PluginBuild) {
      // Overwrites ESBUILD natural process of figuring out
      // where the index.js file is stored
      // referred to as OnResolve Step

      // Handle root entry file of "index.js"
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // Handles relative paths (import statements) in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        // Check if args.path starts with './' or '../'
        return {
          namespace: "a",
          path: new URL(
            args.path,
            // Fixed the case where nested directory is skipped
            "https://unpkg.com" + args.resolveDir + "/"
          ).href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};

export default unpkgPathPlugin;
