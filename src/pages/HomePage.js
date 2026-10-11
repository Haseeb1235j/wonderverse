import { Router } from "../router.js";
import { SearchBar } from "../components/SearchBar.js";
import { StorageService } from "../services/storage.js";
import {
  getCategoryIcon,
  getCategoryLabel,
} from "../generators/categoryDetector.js";
import { icon, escapeHTML } from "../utils/icons.js";

const topics = [
  {
    title: "Black hole",
    heading: "What happens when even light can’t escape?",
    desc: "Explore black holes, where gravity shapes spacetime and challenges our understanding of the universe.",
    cat: "space",
    featured: true,
  },
  {
    title: "Heart",
    heading: "The extraordinary rhythm of the human heart",
    desc: "A closer look at the muscular organ that keeps blood moving through the body.",
    cat: "biology",
  },
  {
    title: "Internet",
    heading: "A world connected by invisible networks",
    desc: "How interconnected computer networks became the internet we use every day.",
    cat: "technology",
  },
  {
    title: "Ancient Rome",
    heading: "What can we learn from ancient Rome?",
    desc: "Discover the civilization that grew from a community on the Italian Peninsula.",
    cat: "history",
  },
  {
    title: "Dinosaur",
    heading: "Life long before us",
    desc: "Meet the diverse group of reptiles that first appeared during the Triassic period.",
    cat: "biology",
  },
  {
    title: "Volcano",
    heading: "When the Earth opens up",
    desc: "Explore the openings in Earth’s crust that release lava, ash, and gases.",
    cat: "earth",
  },
  {
    title: "Quantum mechanics",
    heading: "The rules of the very small",
    desc: "An introduction to how physics describes nature at the scale of atoms.",
    cat: "physics",
  },
  {
    title: "Photosynthesis",
    heading: "How plants turn sunlight into energy",
    desc: "Follow the process that converts light energy into chemical energy.",
    cat: "biology",
  },
];
const startingPoints = [
  "Moon",
  "DNA",
  "Ancient Egypt",
  "Volcano",
  "Quantum Physics",
  "Artificial Intelligence",
  "Photosynthesis",
  "Chemistry",
  "Bitcoin",
  "Geography",
  "Cricket",
  "Ocean",
];
const topicURL = (title) =>
  `#/topic?t=${encodeURIComponent(title.replace(/ /g, "_"))}`;
const illustration = `<div class="feature-illustration" aria-hidden="true"><svg viewBox="0 0 560 220" fill="none">
  <defs><radialGradient id="orbit-light"><stop stop-color="#e7e9ea" stop-opacity=".6"/><stop offset="1" stop-color="#e7e9ea" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="280" cy="112" rx="230" ry="48" stroke="#626b73" stroke-width=".7" transform="rotate(-16 280 112)"/><ellipse cx="280" cy="112" rx="198" ry="35" stroke="#b6bec5" stroke-width="1" transform="rotate(-16 280 112)"/>
  <ellipse cx="280" cy="112" rx="162" ry="22" stroke="#e7e9ea" stroke-width="1.5" transform="rotate(-16 280 112)"/><circle cx="280" cy="108" r="68" fill="url(#orbit-light)"/><circle cx="280" cy="108" r="46" fill="#000" stroke="#e7e9ea" stroke-width="1"/>
  <path d="M227 108c7-78 98-78 106 0" stroke="#8b9299"/><path d="M226 113c6 75 101 75 108 0" stroke="#424a52"/>
  <circle cx="83" cy="52" r="1" fill="#a0a6ac"/><circle cx="450" cy="47" r="1" fill="#a0a6ac"/><circle cx="479" cy="168" r="1" fill="#a0a6ac"/><path d="M41 197h34m-17-17v34" stroke="#536471" stroke-width=".6"/>
  </svg><span>BLACK HOLES · AN ILLUSTRATION</span></div>`;

export const HomePage = {
  filter: "all",
  render() {
    this.filter = "all";
    return `<div class="discovery-layout">
      <div class="discovery-main">
        <section class="discovery-intro"><span class="eyebrow">A SPACE FOR IDEAS</span><h1>Follow your curiosity.</h1><p>Big questions. Fresh perspectives. Something worth discovering.</p>
          ${SearchBar.render("What would you like to understand?", "hero-search")}
        </section>
        <section aria-label="Discover topics"><div class="feed-filters" role="group" aria-label="Filter topics">
          ${[
            ["all", "Discover"],
            ["science", "Science & nature"],
            ["technology", "Technology"],
            ["history", "History"],
          ]
            .map(
              ([id, label]) =>
                `<button class="feed-filter ${id === "all" ? "active" : ""}" data-filter="${id}" aria-pressed="${id === "all"}">${label}</button>`,
            )
            .join("")}
        </div><div id="discovery-feed" aria-live="polite">${this.renderFeed()}</div></section>
        <footer class="discovery-footer">Knowledge from <a href="https://en.wikipedia.org/" target="_blank" rel="noopener noreferrer">Wikipedia ${icon("external", 12)}</a>. A new perspective starts with a question.</footer>
      </div>
      <aside class="discovery-aside" aria-label="More ways to explore">${this.renderAside()}</aside>
    </div>`;
  },
  renderFeed() {
    const filtered = topics.filter(
      (topic) =>
        this.filter === "all" ||
        (this.filter === "science"
          ? ["space", "biology", "earth", "physics", "chemistry"].includes(
              topic.cat,
            )
          : topic.cat === this.filter),
    );
    return filtered
      .map((topic) => {
        const saved = StorageService.isFavorite(topic.title, "topics");
        return `<article class="discovery-post">
        <div class="post-category"><span class="category-avatar">${getCategoryIcon(topic.cat)}</span><span>${getCategoryLabel(topic.cat)}<span class="post-source"> · WonderVerse</span></span>
          <button class="btn btn-ghost btn-icon feed-save" data-title="${escapeHTML(topic.title)}" aria-label="${saved ? "Unsave" : "Save"} ${escapeHTML(topic.title)}" aria-pressed="${saved}">${icon(saved ? "check" : "bookmark", 18)}</button></div>
        <div class="post-content"><a class="post-title" href="${topicURL(topic.title)}"><h2>${topic.heading}</h2></a><p>${topic.desc}</p>
          ${topic.featured ? `<a class="feature-link" href="${topicURL(topic.title)}" aria-label="Explore black holes">${illustration}</a>` : ""}
          <div class="post-actions"><a href="${topicURL(topic.title)}">Explore topic ${icon("arrow", 16)}</a><span>${icon("book", 14)} 5 ways to explore</span></div>
        </div></article>`;
      })
      .join("");
  },
  renderAside() {
    const favorites = StorageService.getFavorites().topics || [];
    const recent = StorageService.getRecentSearches() || [];
    return `<section class="aside-section"><h2>Your library</h2><p>Keep the ideas you want to return to.</p>
      ${
        favorites.length
          ? `<div class="aside-links">${favorites
              .slice(0, 4)
              .map(
                (title) =>
                  `<a href="${topicURL(title)}">${icon("bookmark", 16)}<span>${escapeHTML(title)}</span>${icon("arrow", 14)}</a>`,
              )
              .join("")}</div>`
          : `<div class="library-empty">${icon("bookmark", 22)}<span>Save a topic to start your collection.</span></div>`
      }
      <a class="aside-text-link" href="#/saved">View saved topics ${icon("arrow", 14)}</a></section>
      <section class="aside-section"><h2>A good place to start</h2><p>Pick something that catches your eye.</p><div class="topic-pills">${startingPoints
        .slice(0, 6)
        .map(
          (title) =>
            `<button class="topic-pill" data-query="${title}">${title}</button>`,
        )
        .join("")}</div>
        <details class="more-topics"><summary>More topics</summary><div class="topic-pills">${startingPoints
          .slice(6)
          .map(
            (title) =>
              `<button class="topic-pill" data-query="${title}">${title}</button>`,
          )
          .join("")}</div></details></section>
      ${
        recent.length
          ? `<section class="aside-section"><h2>Recently explored</h2><div class="aside-links">${recent
              .slice(0, 6)
              .map(
                (item) =>
                  `<a href="${topicURL(item.title)}">${icon("clock", 16)}<span>${escapeHTML(item.title)}</span>${icon("arrow", 14)}</a>`,
              )
              .join("")}</div></section>`
          : ""
      }
      <section class="aside-section ways-section"><h2>Make it click.</h2><p>Everyone connects with ideas differently.</p>
        <div class="ways-list">${[
          ["book", "Stories", "Take it one idea at a time."],
          ["learn", "Explanations", "Build a clearer understanding."],
          ["diagram", "Diagrams", "See how concepts connect."],
          ["quiz", "Quizzes", "Put your knowledge to the test."],
          [
            "explore",
            "Related topics",
            "Follow the next interesting question.",
          ],
        ]
          .map(
            ([name, title, desc]) =>
              `<div>${icon(name, 18)}<div><strong>${title}</strong><span>${desc}</span></div></div>`,
          )
          .join("")}</div>
      </section><p class="aside-footnote">Free to explore. No account needed.<br/><a href="#/about">About WonderVerse</a></p>`;
  },
  bindFeed() {
    document.querySelectorAll(".feed-save").forEach((button) =>
      button.addEventListener("click", () => {
        const title = button.dataset.title;
        const saved = StorageService.toggleFavorite(title, "topics");
        button.setAttribute("aria-pressed", String(saved));
        button.setAttribute(
          "aria-label",
          `${saved ? "Unsave" : "Save"} ${title}`,
        );
        button.innerHTML = icon(saved ? "check" : "bookmark", 18);
        document.querySelector(".discovery-aside").innerHTML =
          this.renderAside();
        this.bindTopicPills();
        window.dispatchEvent(
          new CustomEvent("favorite-toggled", {
            detail: { title, added: saved },
          }),
        );
      }),
    );
  },
  bindTopicPills() {
    document
      .querySelectorAll(".topic-pill")
      .forEach((button) =>
        button.addEventListener("click", () =>
          Router.navigate(
            `search?q=${encodeURIComponent(button.dataset.query)}`,
          ),
        ),
      );
  },
  bindEvents() {
    SearchBar.bindEvents("hero-search", (query) =>
      Router.navigate(`search?q=${encodeURIComponent(query)}`),
    );
    document.querySelectorAll(".feed-filter").forEach((button) =>
      button.addEventListener("click", () => {
        this.filter = button.dataset.filter;
        document.querySelectorAll(".feed-filter").forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        document.getElementById("discovery-feed").innerHTML = this.renderFeed();
        this.bindFeed();
      }),
    );
    this.bindFeed();
    this.bindTopicPills();
  },
};
export default HomePage;
