// fullscreen.js
// Universal Fullscreen Viewer with Media Handling

document.addEventListener("DOMContentLoaded", () => {
  const dom = {
    container: document.getElementById("fullscreen-viewer"),
    image: document.getElementById("fullscreen-img"),
    video: document.getElementById("fullscreen-video"),
    closeBtn: document.querySelector(".close-btn")
  };

  // Safety guard
  if (!dom.container) {
    console.warn("Fullscreen viewer element missing (#fullscreen-viewer).");
    return;
  }

  const mediaViewer = {
    isOpen: false,

    toggleScroll(disable) {
      const value = disable ? "hidden" : "";
      document.documentElement.style.overflow = value;
      document.body.style.overflow = value;
    },

    resetMedia() {
      const { image, video } = dom;
      if (video) {
        try { video.pause(); } catch {}
        video.removeAttribute("src");
        video.style.display = "none";
      }
      if (image) {
        image.removeAttribute("src");
        image.style.display = "none";
      }
    },

    show(type, { src, alt = "" }) {
      const { container, image, video } = dom;
      const isVideo = type === 'video';
      const media = isVideo ? video : image;

      if (!media || !container) return;
      
      this.resetMedia();
      media.src = src;
      if (!isVideo && alt) media.alt = alt;
      media.style.display = "block";
      container.style.display = "flex";
      
      if (isVideo) video.play().catch(() => {});
      this.toggleScroll(true);
      this.isOpen = true;
    },

  // Close viewer
    close() {
      const { container } = dom;
      container.style.display = "none";
      this.resetMedia();
      this.toggleScroll(false);
      this.isOpen = false;
    },

    init() {
      // Set up media click handlers
      const selectors = {
        images: ".certificate-card img, .graphic-box img, .web-box img",
        videos: ".video-container video, .web-box video"
      };

      // Image handlers
      document.querySelectorAll(selectors.images).forEach(img => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
          this.show('image', {
            src: img.currentSrc || img.src,
            alt: img.alt || ""
          });
        });
      });

      // Video handlers
      document.querySelectorAll(selectors.videos).forEach(video => {
        video.style.cursor = "pointer";
        video.addEventListener("click", () => {
          const src = video.currentSrc || video.src;
          if (src) this.show('video', { src });
        });
      });

      // Close button
      dom.closeBtn?.addEventListener("click", () => this.close());

      // Close when clicking outside content
      dom.container.addEventListener("click", (e) => {
        if (e.target === dom.container) this.close();
      });

      // Close on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) this.close();
      });
    }
  };

  // Initialize the viewer
  mediaViewer.init();
});
// Accessible ticker: updates a hidden live region from visible ticker items
(function () {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;

  const items = Array.from(document.querySelectorAll('.ticker-item')).map(i => i.textContent.trim()).filter(Boolean);
  if (!items.length) return;

  // Ensure the ticker container is focusable for keyboard users
  ticker.setAttribute('tabindex', ticker.getAttribute('tabindex') || '0');

  const live = document.getElementById('ticker-live');
  if (!live) return;

  let idx = 0;
  const intervalMs = 3000;
  let timer = null;

  function update() {
    live.textContent = items[idx];
    idx = (idx + 1) % items.length;
  }

  function start() {
    if (timer) return;
    update();
    timer = setInterval(update, intervalMs);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  // Pause on hover or focus for accessibility
  ticker.addEventListener('mouseenter', stop);
  ticker.addEventListener('mouseleave', start);
  ticker.addEventListener('focusin', stop);
  ticker.addEventListener('focusout', start);

  // Start the live updates
  start();
})();
// lazyload.js
// ✅ Automatically lazy-load all images and preload videos efficiently

document.addEventListener('DOMContentLoaded', () => {
  // Lazy load all images that don't already specify it
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // Set videos to preload only metadata (faster initial load)
  document.querySelectorAll('video').forEach(video => {
    if (!video.hasAttribute('preload')) {
      video.setAttribute('preload', 'metadata');
    }
  });
});
// Mobile Menu & Animation Controller
document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const elements = {
    menuIcon: document.getElementById("menu-icon"),
    mobileMenu: document.getElementById("mobile-menu"),
    closeBtn: document.getElementById("close-menu"),
    navbar: document.querySelector('.navbar')
  };

  // Validate required elements
  if (!elements.mobileMenu || !elements.menuIcon) {
    console.warn('Mobile menu elements missing. Check IDs: menu-icon, mobile-menu');
    return;
  }

  // Menu state management
  const menu = {
    isOpen: false,
    toggle(show = !this.isOpen) {
      this.isOpen = show;
      elements.mobileMenu.classList.toggle("open", show);
      document.body.classList.toggle("no-scroll", show);
    }
  };

  // Event delegation for menu interactions
  document.addEventListener("click", ({ target }) => {
    const { menuIcon, mobileMenu } = elements;
    
    // Toggle menu on icon click
    if (target.closest("#menu-icon")) {
      menu.toggle(true);
      return;
    }

    // Close menu on outside click or menu link click
    if (menu.isOpen && (
      target.closest("#mobile-menu a") || 
      (!mobileMenu.contains(target) && !menuIcon.contains(target))
    )) {
      menu.toggle(false);
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.isOpen) menu.toggle(false);
  });

  // Optional close button handler
  elements.closeBtn?.addEventListener("click", () => menu.toggle(false));

  // Efficient scroll handler with debounce
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      elements.navbar?.classList.toggle('scrolled', window.scrollY > 50);
      scrollTimeout = null;
    }, 100);
  }, { passive: true });

  // Intersection Observer for animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.classList.add("visible");
      
      // Special handling for about section
      if (entry.target.classList.contains("about-section")) {
        ["about-left", "about-right"].forEach(className => {
          entry.target.querySelector(`.${className}`)?.classList.add("visible");
        });
      }
    });
  }, { threshold: 0.2 });
elements.sections = document.querySelectorAll("section");

  // Observe all sections
  elements.sections.forEach(sec => observer.observe(sec));
});
