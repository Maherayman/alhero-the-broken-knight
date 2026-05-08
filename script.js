document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".page-wrapper");
  if (!wrapper) return;

  const topButton = document.createElement("button");
  topButton.className = "top-btn";
  topButton.textContent = "Back to Top";
  document.body.appendChild(topButton);

  topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", function () {
    topButton.classList.toggle("visible", window.scrollY > 200);
  });

  // Language switching
  const langEnBtn = document.getElementById("lang-en");
  const langArBtn = document.getElementById("lang-ar");
  const langEnDiv = document.querySelector(".lang-en");
  const langArDiv = document.querySelector(".lang-ar");

  function switchLanguage(lang) {
    if (lang === "en") {
      langEnDiv.classList.add("active");
      langArDiv.classList.remove("active");
      langEnBtn.classList.add("active");
      langArBtn.classList.remove("active");
      topButton.textContent = "Back to Top";
    } else if (lang === "ar") {
      langArDiv.classList.add("active");
      langEnDiv.classList.remove("active");
      langArBtn.classList.add("active");
      langEnBtn.classList.remove("active");
      topButton.textContent = "العودة إلى الأعلى";
    }
  }

  langEnBtn.addEventListener("click", () => switchLanguage("en"));
  langArBtn.addEventListener("click", () => switchLanguage("ar"));

  function highlightNames(root) {
    const regex =
      /\b(?:Aya|AYA|aya|Alhero|ALHERO|alhero|memo|MEMO|Memo|ألهيرو|اية|أية)\b/g;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "A"].includes(node.parentElement.tagName))
          return NodeFilter.FILTER_REJECT;
        if (
          node.parentElement.matches &&
          node.parentElement.matches(
            "span.highlight-aya, span.highlight-alhero, span.highlight-memo",
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return regex.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      const text = node.nodeValue;
      let lastIndex = 0;

      text.replace(regex, (match, offset) => {
        if (offset > lastIndex) {
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex, offset)),
          );
        }
        const span = document.createElement("span");
        const lower = match.toLowerCase();
        if (lower.includes("memo")) {
          span.className = "highlight-memo";
        } else if (
          lower.includes("aya") ||
          match.includes("اية") ||
          match.includes("أية")
        ) {
          span.className = "highlight-aya";
        } else {
          span.className = "highlight-alhero";
        }
        span.textContent = match;
        frag.appendChild(span);
        lastIndex = offset + match.length;
      });

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      if (frag.childNodes.length) {
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  highlightNames(langEnDiv);
  highlightNames(langArDiv);

  function getActiveLangContainer() {
    return langEnDiv.classList.contains("active") ? langEnDiv : langArDiv;
  }

  function getProgressBanner() {
    const activeContainer = getActiveLangContainer();
    return activeContainer.querySelector(".progress-banner");
  }

  function getTocLinks() {
    const activeContainer = getActiveLangContainer();
    return activeContainer.querySelectorAll(".story-toc a");
  }

  const pageNote = getActiveLangContainer().querySelector(".page-note");
  const storyToc = getActiveLangContainer().querySelector(".story-toc");
  const chapterSections = getActiveLangContainer().querySelectorAll(".chapter");
  const progressBanner = getProgressBanner();
  const tocLinks = getTocLinks();

  const fadeTargets = [pageNote, storyToc, ...chapterSections];
  fadeTargets.forEach((node) => node && node.classList.add("fade-in"));

  tocLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(this.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          if (entry.target.classList.contains("chapter")) {
            const title = entry.target.querySelector("h2").textContent;
            const banner = getProgressBanner();
            if (banner) {
              const isArabic = getActiveLangContainer() === langArDiv;
              banner.textContent = isArabic
                ? "تقرأ الآن: " + title
                : "Now reading: " + title;
            }
            const links = getTocLinks();
            links.forEach((link) => {
              link.classList.toggle(
                "active",
                link.hash === "#" + entry.target.id,
              );
            });
          }
        }
      });
    },
    {
      threshold: 0.35,
    },
  );

  fadeTargets.forEach((node) => node && observer.observe(node));

  const headings = getActiveLangContainer().querySelectorAll("h2");
  headings.forEach((heading) => {
    heading.addEventListener("click", function () {
      headings.forEach((h) => h.classList.remove("highlighted"));
      this.classList.add("highlighted");
    });
  });

  // Reinitialize on language switch
  langEnBtn.addEventListener("click", () => {
    setTimeout(() => {
      const newPageNote = getActiveLangContainer().querySelector(".page-note");
      const newStoryToc = getActiveLangContainer().querySelector(".story-toc");
      const newChapterSections =
        getActiveLangContainer().querySelectorAll(".chapter");
      const newFadeTargets = [newPageNote, newStoryToc, ...newChapterSections];
      newFadeTargets.forEach((node) => node && node.classList.add("fade-in"));
      newFadeTargets.forEach((node) => node && observer.observe(node));

      const newHeadings = getActiveLangContainer().querySelectorAll("h2");
      newHeadings.forEach((heading) => {
        heading.addEventListener("click", function () {
          newHeadings.forEach((h) => h.classList.remove("highlighted"));
          this.classList.add("highlighted");
        });
      });
    }, 100);
  });

  langArBtn.addEventListener("click", () => {
    setTimeout(() => {
      const newPageNote = getActiveLangContainer().querySelector(".page-note");
      const newStoryToc = getActiveLangContainer().querySelector(".story-toc");
      const newChapterSections =
        getActiveLangContainer().querySelectorAll(".chapter");
      const newFadeTargets = [newPageNote, newStoryToc, ...newChapterSections];
      newFadeTargets.forEach((node) => node && node.classList.add("fade-in"));
      newFadeTargets.forEach((node) => node && observer.observe(node));

      const newHeadings = getActiveLangContainer().querySelectorAll("h2");
      newHeadings.forEach((heading) => {
        heading.addEventListener("click", function () {
          newHeadings.forEach((h) => h.classList.remove("highlighted"));
          this.classList.add("highlighted");
        });
      });
    }, 100);
  });
});
