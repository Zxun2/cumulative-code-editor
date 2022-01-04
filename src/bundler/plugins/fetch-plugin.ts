import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // Attempt to load up files (imports) passed from onResolve step
      // referred to as OnLoad Step

      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        // Every callback must provide a regular expression as a filter. This is used by esbuild to skip calling the
        // callback when the path doesn't match its filter, which is done for performance.
        return {
          // Load hard coded content
          loader: "jsx",
          contents: inputCode,
        };
      });

      // Middle ware that doesnt return anything but gets execute
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check to see if we have already fetched this file
        // and if it is in the cache return it immediately
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }
      });

      // Check file types - sadly, there's no way to produce a css and js file separately as we do not have a file system in the browser.
      // The solution here is to somehow convert the css file to a js file
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // Request is needed to retrieve the last visited dir
        // aka who requested it
        const { data, request } = await axios.get(args.path);

        const escaped = data
          // replace all new line characters with an empty string
          .replace(/\n/g, "")
          // replace all doublequotes with \\"
          .replace(/"/g, '\\"')
          // replace all singlequotes with \\'
          .replace(/'/g, "\\'");

        // Creating a stylesheet manually (ESBuild bundles everything into one js file)
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      // Every module has an associated namespace. By default esbuild operates in the file namespace,
      // which corresponds to files on the file system.
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Request is needed to retrieve the last visited dir
        // aka who requested it
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
