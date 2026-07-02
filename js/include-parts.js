(function () {
  // detail pages should highlight their parent list page in the nav
  var NAV_ALIASES = {
    "news-detail.html": "news.html",
    "discography-detail.html": "discography.html"
  };

  function currentPageFile() {
    var file = location.pathname.split("/").pop();
    if (!file) file = "index.html";
    return NAV_ALIASES[file] || file;
  }

  function markCurrentNav(root) {
    var current = currentPageFile();
    if (current === "index.html") return; // homepage has no current nav item

    root.querySelectorAll(".header__nav-link, .drawer__link").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && href.replace("./", "") === current) {
        link.classList.add("is-current");
      }
    });
  }

  function loadPart(selector, url, onInserted) {
    var placeholder = document.querySelector(selector);
    if (!placeholder) return;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + url);
        return res.text();
      })
      .then(function (html) {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        var modifier = placeholder.getAttribute("data-header-modifier");
        if (modifier) {
          var headerEl = wrapper.querySelector(".header");
          if (headerEl) headerEl.classList.add(modifier);
        }

        placeholder.replaceWith(wrapper);
        while (wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }
        wrapper.remove();

        if (onInserted) onInserted();
        document.dispatchEvent(new CustomEvent("parts:loaded", { detail: { url: url } }));
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  loadPart("#header-placeholder", "./parts/header.html", function () {
    markCurrentNav(document);
  });
  loadPart("#footer-placeholder", "./parts/footer.html");
})();
