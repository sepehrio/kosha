(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const mock = document.querySelector(".mock");
  if (!mock) return;

  const animateCount = (el, to, suffix = "") => {
    if (reduce) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(to * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const startMock = () => {
    mock.classList.add("is-live");
    mock.querySelectorAll("[data-count]").forEach((el) => {
      const n = Number(el.getAttribute("data-count") || "0");
      const suffix = el.classList.contains("mock__pct") ? "٪" : "";
      animateCount(el, n, suffix);
    });
  };

  if ("IntersectionObserver" in window) {
    const mio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startMock();
          mio.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    mio.observe(mock);
  } else {
    startMock();
  }
})();
