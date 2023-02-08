import { writable } from "svelte/store";

import type { ProductDetail } from "@/interfaces/retailer";

export const retailerName = writable("");
export const featuredProducts = writable<ProductDetail[]>([]);
export const supportedLanguages = writable<string[]>([]);
export const availableRetailersQty = writable(0);
