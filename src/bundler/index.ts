import * as esbuild from "esbuild-wasm";
import unpkgPathPlugin from "./plugins/unpkg-path-plugins";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;
const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      // Configurations
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      // first file to be bundled
      entryPoints: ["index.js"],
      bundle: true,
      // disallow writing to file system
      write: false,
      // onResolve, and onLoad interception
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        // replace any instance of {key} with {value}
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    // bundled code
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err: any) {
    return {
      code: "",
      err: err instanceof Error ? err.message : "Bundling Error",
    };
  }
};

export default bundle;
