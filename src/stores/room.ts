import { writable } from "svelte/store";

export const currentRoom = writable("entry");
export const selectedProductCategory = writable("");
export const isFromNavatarPage = writable(false);
export const isFromPostPage = writable(false);
export const isFromGamePage = writable(false);
export const reloadNavatar = writable(false);
