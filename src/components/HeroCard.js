import { StorageService } from "../services/storage.js";
import {
  getCategoryIcon,
  getCategoryLabel,
  getDifficultyLevel,
} from "../generators/categoryDetector.js";
import { VoiceService } from "../services/voice.js";
import { Toast } from "./ui/Toast.js";
import { icon, escapeHTML } from "../utils/icons.js";
export const HeroCard = {
  render(data, category) {
    const title = escapeHTML(data.title),
      image = data.thumbnail?.source;
    const saved = StorageService.isFavorite(data.title, "topics");
    const wikiURL =
      data.content_urls?.desktop?.page ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title.replace(/ /g, "_"))}`;
    return `<section class="topic-hero"><div class="hero-image-wrapper">${image ? `<img class="hero-image" src="${escapeHTML(image)}" alt="${title}" />` : `<div class="hero-image-placeholder">${getCategoryIcon(category)}</div>`}</div>
      <div class="hero-info"><div class="hero-metadata"><span class="badge">${getCategoryIcon(category)} ${getCategoryLabel(category)}</span><span class="badge badge-${getDifficultyLevel(data.extract || "")}">${getDifficultyLevel(data.extract || "")}</span></div>
        <div class="hero-title-row"><h1>${title}</h1><button id="hero-save-btn" class="btn btn-secondary btn-sm" aria-pressed="${saved}">${icon(saved ? "check" : "bookmark", 16)} ${saved ? "Saved" : "Save"}</button></div>
        <p>${escapeHTML(data.extract || "No description available.")}</p><div class="hero-actions"><a href="${escapeHTML(wikiURL)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">Wikipedia ${icon("external", 14)}</a>
          <button id="hero-speak-btn" class="btn btn-ghost btn-sm">${icon("volume", 16)} Listen</button><button id="hero-share-btn" class="btn btn-ghost btn-sm">${icon("share", 16)} Share</button><button id="hero-copy-btn" class="btn btn-ghost btn-sm">${icon("copy", 16)} Copy link</button></div></div></section>`;
  },
  bindEvents(data) {
    const title = data.title,
      save = document.getElementById("hero-save-btn");
    save?.addEventListener("click", () => {
      const added = StorageService.toggleFavorite(title, "topics");
      save.innerHTML = `${icon(added ? "check" : "bookmark", 16)} ${added ? "Saved" : "Save"}`;
      save.setAttribute("aria-pressed", String(added));
      window.dispatchEvent(
        new CustomEvent("favorite-toggled", { detail: { title, added } }),
      );
    });
    const copy = document.getElementById("hero-copy-btn");
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copy.innerHTML = `${icon("check", 16)} Copied`;
        setTimeout(() => {
          if (copy.isConnected)
            copy.innerHTML = `${icon("copy", 16)} Copy link`;
        }, 2000);
        return true;
      } catch {
        Toast.show(
          "Could not copy the link. You can copy the address from your browser.",
          "error",
        );
        return false;
      }
    };
    copy?.addEventListener("click", copyLink);
    document
      .getElementById("hero-share-btn")
      ?.addEventListener("click", async () => {
        if (!navigator.share) {
          if (await copyLink())
            Toast.show("Link copied. Share it wherever you like.", "info");
          return;
        }
        try {
          await navigator.share({
            title: `${title} — WonderVerse`,
            text: `Explore ${title} on WonderVerse`,
            url: window.location.href,
          });
        } catch (error) {
          if (error.name !== "AbortError")
            Toast.show(
              "Sharing is unavailable in this browser. Try Copy link.",
              "error",
            );
        }
      });
    const speak = document.getElementById("hero-speak-btn");
    const showListen = () => {
      speak.innerHTML = `${icon("volume", 16)} Listen`;
    };
    speak?.addEventListener("click", () => {
      if (VoiceService.isPlaying()) {
        VoiceService.stop();
        showListen();
        return;
      }
      speak.innerHTML = `${icon("stop", 16)} Stop`;
      VoiceService.speak(
        data.extract,
        () => {
          speak.innerHTML = `${icon("stop", 16)} Stop`;
        },
        showListen,
        () => {
          showListen();
          Toast.show("Narration is unavailable in this browser.", "info");
        },
      );
    });
  },
};
export default HeroCard;
