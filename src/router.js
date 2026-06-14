// Router Component — Hash-based client-side router
import { HomePage } from "./pages/HomePage.js";
import { SearchPage } from "./pages/SearchPage.js";
import { TopicPage } from "./pages/TopicPage.js";
import { SavedPage } from "./pages/SavedPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { BadgesPage } from "./pages/BadgesPage.js";
import { AboutPage } from "./pages/AboutPage.js";
import { DiagramsHubPage } from "./pages/DiagramsHubPage.js";
import { ErrorPage } from "./pages/ErrorPage.js";
import { VoiceService } from "./services/voice.js";

class HashRouter {
  constructor() {
    this.routes = {
      '/': HomePage,
      '/search': SearchPage,
      '/topic': TopicPage,
      '/saved': SavedPage,
      '/dashboard': DashboardPage,
      '/badges': BadgesPage,
      '/about': AboutPage,
      '/diagrams': DiagramsHubPage
    };
    
    this.currentView = null;
  }

  init(onRouteCallback) {
    this.onRoute = onRouteCallback;
    
    // Bind listeners
    window.addEventListener("hashchange", () => this.handleRouting());
    window.addEventListener("load", () => this.handleRouting());
    
    // Initial routing run
    this.handleRouting();
  }

  navigate(path) {
    const cleanPath = path.startsWith("#/") ? path.slice(2) : (path.startsWith("#") ? path.slice(1) : path);
    window.location.hash = `#/${cleanPath}`;
  }

  parseRoute() {
    const hash = window.location.hash || "#/";
    
    // Normalize hash
    let hashContent = hash.startsWith("#/") ? hash.slice(2) : (hash.startsWith("#") ? hash.slice(1) : hash);
    hashContent = decodeURIComponent(hashContent).trim();
    
    if (hashContent === "" || hashContent === "/" || hashContent === "landing") {
      return { route: '/', params: {} };
    }
    
    // Split path and query params
    const [pathPart, queryString] = hashContent.split("?");
    const path = '/' + pathPart.split("/").filter(s => s.length > 0).join("/");
    
    // Parse query params
    const params = {};
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      for (const [key, value] of urlParams.entries()) {
        params[key] = value;
      }
    }
    
    // Support legacy paths: #/topic/Black_Hole/story -> t=Black_Hole&mode=story
    const segments = pathPart.split("/").filter(s => s.length > 0);
    if (segments[0] === "topic" && segments.length > 1) {
      params['t'] = segments[1];
      if (segments[2]) {
        params['mode'] = segments[2];
      }
      return { route: '/topic', params };
    }
    if (segments[0] === "search" && segments.length > 1) {
      params['q'] = segments[1];
      return { route: '/search', params };
    }

    return { route: path, params };
  }

  handleRouting() {
    const { route, params } = this.parseRoute();
    const page = this.routes[route] || ErrorPage;

    // Stop any active speech synthesis on route change
    VoiceService.stop();

    // Clean up previous view to prevent animation frame leaks
    if (this.currentView && typeof this.currentView.destroy === "function") {
      this.currentView.destroy();
    }

    this.currentView = page;
    
    // Highlight sidebar links
    this.updateActiveNavLinks(route);
    
    // Mount page
    const appEl = document.getElementById("app");
    if (appEl) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      appEl.innerHTML = page.render(params);
      
      if (typeof page.bindEvents === "function") {
        page.bindEvents(params);
      }
    }

    // Trigger callback
    if (this.onRoute) {
      this.onRoute({ route, params });
    }
  }

  updateActiveNavLinks(route) {
    document.querySelectorAll(".nav-link, .bottom-nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;
      
      const cleanHref = href.startsWith("#/") ? href.slice(1) : (href.startsWith("#") ? href : '/' + href);
      const isHome = route === '/' && (cleanHref === '#/' || cleanHref === '#/landing');
      
      if (cleanHref === `#${route}` || isHome) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  back() {
    window.history.back();
  }
}

export const Router = new HashRouter();
export default Router;
