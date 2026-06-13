// SearchBar Component
export const SearchBar = {
  render(placeholder = "Search any topic...", id = "search-input", initialValue = "") {
    return `
      <div class="search-wrapper">
        <input 
          type="text" 
          id="${id}" 
          class="search-input" 
          placeholder="${placeholder}" 
          value="${initialValue}" 
          autocomplete="off" 
          name="wonderverse-search-input"
        />
        <button id="${id}-btn" class="search-btn">Scan</button>
      </div>
    `;
  },

  bindEvents(id, onSearch) {
    const input = document.getElementById(id);
    const btn = document.getElementById(`${id}-btn`);

    const trigger = () => {
      const q = input.value.trim();
      if (q) {
        onSearch(q);
      }
    };

    input?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        trigger();
      }
    });

    btn?.addEventListener("click", () => {
      trigger();
    });
  }
};

export default SearchBar;
