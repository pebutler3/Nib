import includePaths from "rollup-plugin-includepaths";
import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import {uglify} from "rollup-plugin-uglify";
import bundleSize from "rollup-plugin-bundle-size";
import sourcemaps from "rollup-plugin-sourcemaps";
import copy from "rollup-plugin-copy";

const globals = {
  react: "React",
  "react-dom": "ReactDOM"
};

const external = ["react", "react-dom"];

const getCopyConf = packageName => ({
  targets: [
    {
      src: `packages/${packageName}/package.json`,
      dest: `packages/${packageName}/build`
    }
  ],
  verbose: true
});

const getConfig = packageName => {
  const copyConf = getCopyConf(packageName);
  if (packageName !== "core") {
    globals.styled = "@emotion/styled";
    globals["emotion-theming"] = "emotion-theming";
    external.push("styled");
    external.push("emotion-theming");
    copyConf.targets.push({
      src: `packages/${packageName}/readme.md`,
      dest: `packages/${packageName}/build`
    });
  } else {
    copyConf.targets.push({
      src: "readme.md",
      dest: `packages/${packageName}/build`
    });
  }
  return {
    input: `packages/${packageName}/index.js`,
    output: {
      file: `packages/${packageName}/build/index.js`,
      format: "umd",
      globals,
      name: packageName,
      sourceMap: true
    },
    external,
    plugins: [
      uglify(),
      bundleSize(),
      nodeResolve({
        browser: true
      }),
      babel({
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: [
          [
            "emotion",
            {
              hoist: true
            }
          ],
          [
            "@babel/plugin-proposal-class-properties",
            {
              loose: true
            }
          ]
        ],
        exclude: "node_modules/**"
      }),
      includePaths({
        extensions: [".js", ".jsx"]
      }),
      commonjs({
        include: "node_modules/**"
      }),
      copy(copyConf),
      sourcemaps()
    ]
  };
};

export default args => {
  return getConfig(args.name);
};
