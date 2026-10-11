import { wikiArticleURL } from "./sourceText.js";

// Wikipedia section markup remains external content; remove executable elements
// and resolve article/citation links to Wikipedia instead of this app's router.
export function prepareArticleHTML(html, title) {
  if (typeof html !== "string") return "";
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed
    .querySelectorAll(
      "script, style, iframe, object, embed, link, meta, base, form, input, button, textarea, select, svg",
    )
    .forEach((element) => element.remove());
  parsed.querySelectorAll("*").forEach((element) => {
    for (const attribute of [...element.attributes]) {
      if (
        /^on/i.test(attribute.name) ||
        ["srcdoc", "srcset", "xlink:href", "action", "formaction"].includes(
          attribute.name,
        )
      )
        element.removeAttribute(attribute.name);
      if (
        attribute.name === "style" &&
        /url\s*\(|expression\s*\(/i.test(attribute.value)
      )
        element.removeAttribute("style");
    }
    for (const name of ["href", "src"]) {
      if (!element.hasAttribute(name)) continue;
      try {
        const url = new URL(element.getAttribute(name), wikiArticleURL(title));
        if (
          !["http:", "https:"].includes(url.protocol) ||
          url.username ||
          url.password
        )
          element.removeAttribute(name);
        else element.setAttribute(name, url.href);
      } catch {
        element.removeAttribute(name);
      }
    }
    if (element.tagName === "A") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
    if (element.tagName === "IMG") element.setAttribute("loading", "lazy");
  });
  return parsed.body.innerHTML;
}
