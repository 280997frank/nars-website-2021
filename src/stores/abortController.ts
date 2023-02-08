import { readable } from "svelte/store";

const _abortController = new AbortController();
const abortController = readable(_abortController);

export default abortController;
