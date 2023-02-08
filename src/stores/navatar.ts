import type {
  THairColorResponse,
  TLookbook,
  TModel,
  TProductsByLookbookIdResponse,
  TSkintonesByLookbookIdResponse,
} from "@/interfaces/navatar";
import { Writable, writable } from "svelte/store";

export const navatarFace = writable("");
export const selectedNavatarModel = writable({
  lookBookId: "",
  lookBookTexture: "",
  skintone: "",
  hairColor: "",
  headModel: "",
  bodyModel: "",
});

export const showLookbookNavatar: Writable<TLookbook | null> = writable(null);

export const backFromNavatar = writable("");

// store list from DB
export const lookbooksStore: Writable<TLookbook[]> = writable();
export const lookbookSkintonesStore: Writable<TSkintonesByLookbookIdResponse> =
  writable();
export const lookbookProductsStore: Writable<TProductsByLookbookIdResponse> =
  writable();
export const hairColorsStore: Writable<THairColorResponse> = writable();
export const headsStore: Writable<TModel[]> = writable();
export const outfitStore: Writable<TModel[]> = writable();

export const productsUsedBySelectedLookbook = writable<string[]>([]);
