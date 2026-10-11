import { icon, escapeHTML } from "../utils/icons.js";
export const SearchBar = {
  render(
    placeholder = "Search any topic",
    id = "search-input",
    initialValue = "",
  ) {
    return `<form class="search-wrapper" role="search" aria-label="Topic search" id="${id}-form">${icon("search", 18)}
      <input type="search" id="${id}" class="search-input" placeholder="${escapeHTML(placeholder)}" value="${escapeHTML(initialValue)}" aria-label="Search topics" autocomplete="off" name="q" />
      <button type="submit" id="${id}-btn" class="search-btn">Search</button></form>`;
  },
  bindEvents(id, onSearch) {
    const input = document.getElementById(id);
    document
      .getElementById(`${id}-form`)
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = input?.value.trim();
        if (query) onSearch(query);
        else input?.focus();
      });
  },
};
export default SearchBar;
