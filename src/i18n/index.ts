import { register, init /* getLocaleFromNavigator */ } from "svelte-i18n";

register("zh-CN", () => import("./zh-CN.json"));
register("en", () => import("./en.json"));

if (!localStorage.getItem("locale")) {
  localStorage.setItem("locale", "zh-CN" /* getLocaleFromNavigator() */);
}

const locale = localStorage.getItem("locale");

init({
  fallbackLocale: "en",
  initialLocale: locale,
});
