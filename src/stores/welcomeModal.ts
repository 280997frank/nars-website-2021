import { writable } from "svelte/store";

export const isWelcomeModalShown = writable(false);
export const isLoginFormShown = writable(false);
export const isSignupFormShown = writable(false);
export const isExploreButtonShown = writable(false);
