/* import sveltePreprocess from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess({
    scss: { includePaths: ["src", "node_modules"] },
  }),
}; */

const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: sveltePreprocess({
    scss: { includePaths: ["src", "node_modules"] },
  }),
};
