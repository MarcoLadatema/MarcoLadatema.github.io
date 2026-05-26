import tr from "./tr.json";
import en from "./en.json";

const çeviriler = { tr, en };

export type Dil = keyof typeof çeviriler;

export function çeviriAl(dil: Dil) {
  return çeviriler[dil];
}

export function dilAl(url: URL): Dil {
  const [, dil] = url.pathname.split("/");
  if (dil === "en") return "en";
  return "tr";
}
