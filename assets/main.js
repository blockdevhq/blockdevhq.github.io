(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const root = document.documentElement;

  const setText = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  setText("[data-business-name]", config.businessName || config.displayName);
  setText("[data-availability]", config.availability);
  setText("[data-location]", config.location);
  setText("[data-year]", String(new Date().getFullYear()));

  const locationWrap = document.querySelector("[data-location-wrap]");
  if (locationWrap && config.location) {
    locationWrap.hidden = false;
  }

  const configureLink = (selector, url) => {
    const link = document.querySelector(selector);
    if (!link || !url) return false;
    link.href = url;
    link.hidden = false;
    return true;
  };

  const hasEmail = configureLink(
    "[data-email-link]",
    config.email ? `mailto:${config.email}` : ""
  );
  const hasGithub = configureLink("[data-github-link]", config.githubUrl);
  const hasLinkedIn = configureLink("[data-linkedin-link]", config.linkedinUrl);

  const openSourceFallback = document.querySelector("[data-open-source-fallback]");
  if (openSourceFallback && (hasEmail || hasGithub || hasLinkedIn)) {
    openSourceFallback.hidden = true;
  }

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const closeNavigation = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    root.classList.remove("nav-open");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      root.classList.toggle("nav-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealElements = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const observedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        sectionLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const canvas = document.querySelector("[data-network-canvas]");
  if (!canvas || prefersReducedMotion) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let frameId = 0;
  let nodes = [];
  let documentVisible = true;

  const getNodeCount = () => {
    const area = width * height;
    return Math.max(24, Math.min(72, Math.floor(area / 22000)));
  };

  const makeNode = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.17,
    vy: (Math.random() - 0.5) * 0.17,
    radius: Math.random() * 1.3 + 0.7,
    phase: Math.random() * Math.PI * 2
  });

  const resizeCanvas = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = getNodeCount();
    if (nodes.length > count) nodes = nodes.slice(0, count);
    while (nodes.length < count) nodes.push(makeNode());
  };

  const draw = (time) => {
    if (!documentVisible) return;
    context.clearRect(0, 0, width, height);

    const maxDistance = Math.min(150, Math.max(105, width * 0.11));

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -10) node.x = width + 10;
      if (node.x > width + 10) node.x = -10;
      if (node.y < -10) node.y = height + 10;
      if (node.y > height + 10) node.y = -10;
    });

    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const dx = nodes[first].x - nodes[second].x;
        const dy = nodes[first].y - nodes[second].y;
        const distance = Math.hypot(dx, dy);

        if (distance >= maxDistance) continue;
        const alpha = (1 - distance / maxDistance) * 0.12;
        context.beginPath();
        context.moveTo(nodes[first].x, nodes[first].y);
        context.lineTo(nodes[second].x, nodes[second].y);
        context.strokeStyle = `rgba(143, 255, 202, ${alpha})`;
        context.lineWidth = 0.8;
        context.stroke();
      }
    }

    nodes.forEach((node) => {
      const pulse = 0.55 + Math.sin(time * 0.0012 + node.phase) * 0.25;
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(177, 255, 212, ${pulse})`;
      context.fill();
    });

    frameId = window.requestAnimationFrame(draw);
  };

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);
  resizeCanvas();
  frameId = window.requestAnimationFrame(draw);

  document.addEventListener("visibilitychange", () => {
    documentVisible = !document.hidden;
    if (documentVisible) {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(draw);
    }
  });
})();
