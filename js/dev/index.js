import { b as bodyLockToggle, a as bodyLockStatus, g as getDigFormat, u as uniqArray } from "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.querySelector(".search-header__input");
  const searchIcon = document.querySelector(".search-header__search-icon");
  const clearButton = document.querySelector(".search-header__clear");
  const html = document.documentElement;
  const dropdown = document.querySelector(".menu__item--dropdown");
  if (dropdown) {
    const dropdownBtn = dropdown.querySelector(".menu__link");
    if (dropdownBtn) {
      let touchDevice = false;
      dropdown.addEventListener("touchstart", function() {
        touchDevice = true;
      }, { once: true });
      dropdownBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        const isExpanded = dropdown.getAttribute("aria-expanded") === "true";
        dropdown.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      });
      dropdown.addEventListener("mouseenter", function() {
        if (!touchDevice) {
          this.setAttribute("aria-expanded", "true");
        }
      });
      dropdown.addEventListener("mouseleave", function() {
        if (!touchDevice) {
          this.setAttribute("aria-expanded", "false");
        }
      });
      dropdown.addEventListener("focusout", function(e) {
        if (!dropdown.contains(e.relatedTarget)) {
          dropdown.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("click", function(e) {
        if (!dropdown.contains(e.target)) {
          dropdown.setAttribute("aria-expanded", "false");
        }
      });
    }
  }
  function initAlertBanner() {
    const sitetopbar = document.querySelector(".site-topbar");
    const closeBtn = document.querySelector(".alert-banner__close");
    if (sitetopbar && closeBtn) {
      closeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        sitetopbar.classList.add("site-topbar--anim");
        setTimeout(() => {
          document.documentElement.style.setProperty("--alertBannerHeight", "0px");
          sitetopbar.classList.add("site-topbar--hidden");
        }, 300);
      });
    }
  }
  const isSmallScreen = () => window.innerWidth < 479.98;
  function openSearch() {
    if (!isSmallScreen()) return;
    html.setAttribute("search-active", "");
    searchInput.focus();
  }
  function closeSearch() {
    html.removeAttribute("search-active");
    if (clearButton) {
      clearButton.classList.remove("close-btn--active");
    }
  }
  function updateClearButtonState() {
    if (!clearButton || !searchInput) return;
    if (searchInput.value.length > 0) {
      clearButton.classList.add("close-btn--active");
    } else {
      clearButton.classList.remove("close-btn--active");
    }
  }
  initAlertBanner();
  if (searchIcon) {
    searchIcon.addEventListener("click", function(e) {
      e.preventDefault();
      if (isSmallScreen()) {
        if (html.hasAttribute("search-active")) {
          if (searchInput.value === "") {
            closeSearch();
          } else {
            searchInput.form.submit();
          }
        } else {
          openSearch();
        }
      } else {
        searchInput.form.submit();
      }
      updateClearButtonState();
    });
  }
  if (clearButton && searchInput) {
    clearButton.addEventListener("click", function(e) {
      e.preventDefault();
      searchInput.value = "";
      searchInput.focus();
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    searchInput.addEventListener("input", function() {
      updateClearButtonState();
    });
    updateClearButtonState();
  }
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && html.hasAttribute("search-active")) {
      closeSearch();
    }
  });
  document.addEventListener("click", function(e) {
    const searchForm = document.querySelector(".search-header");
    if (html.hasAttribute("search-active") && !searchForm.contains(e.target) && e.target !== searchIcon) {
      closeSearch();
    }
  });
  const alertBanner = document.querySelector(".alert-banner");
  if (alertBanner) {
    const resizeObserver = new ResizeObserver(() => {
      const height = alertBanner.offsetHeight;
      document.documentElement.style.setProperty("--alertBannerHeight", `${height}px`);
    });
    resizeObserver.observe(alertBanner);
  }
});
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("scroll", function(e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
function digitsCounter() {
  const animatedCounters = /* @__PURE__ */ new Set();
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-fls-digcounter]");
    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter2) => {
        if (digitsCounter2.hasAttribute("data-fls-digcounter-once") && animatedCounters.has(digitsCounter2)) return;
        if (digitsCounter2.hasAttribute("data-fls-digcounter-go")) return;
        digitsCounter2.setAttribute("data-fls-digcounter-go", "");
        const originalValue = digitsCounter2.innerHTML.trim();
        digitsCounter2.dataset.flsDigcounter = originalValue;
        const format = originalValue.includes(",") ? "," : " ";
        if (!digitsCounter2.dataset.flsDigcounterFormat) {
          digitsCounter2.dataset.flsDigcounterFormat = format;
        }
        digitsCounter2.innerHTML = `0`;
        digitsCountersAnimate(digitsCounter2);
        if (digitsCounter2.hasAttribute("data-fls-digcounter-once")) {
          animatedCounters.add(digitsCounter2);
        }
      });
    }
  }
  function digitsCountersAnimate(digitsCounter2) {
    let startTimestamp = null;
    const duration = parseFloat(digitsCounter2.dataset.flsDigcounterSpeed) ? parseFloat(digitsCounter2.dataset.flsDigcounterSpeed) : 1e3;
    const originalValue = digitsCounter2.dataset.flsDigcounter;
    const startValue = parseFloat(originalValue.replace(/,/g, "").replace(/\s/g, ""));
    const format = digitsCounter2.dataset.flsDigcounterFormat ? digitsCounter2.dataset.flsDigcounterFormat : ",";
    const startPosition = 0;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (startPosition + startValue));
      digitsCounter2.innerHTML = getDigFormat(value, format);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        digitsCounter2.innerHTML = getDigFormat(startValue, format);
        digitsCounter2.removeAttribute("data-fls-digcounter-go");
      }
    };
    window.requestAnimationFrame(step);
  }
  function digitsCounterAction(e) {
    const entry = e.detail.entry;
    const targetElement = entry.target;
    if (targetElement.querySelectorAll("[data-fls-digcounter]").length && !targetElement.querySelectorAll("[data-fls-watcher]").length && entry.isIntersecting) {
      digitsCountersInit(targetElement.querySelectorAll("[data-fls-digcounter]"));
    }
  }
  document.addEventListener("watcherCallback", digitsCounterAction);
}
document.querySelector("[data-fls-digcounter]") ? window.addEventListener("load", digitsCounter) : null;
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.hasAttribute("data-fls-watch") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаємо конструктор
  scrollWatcherRun() {
    document.documentElement.setAttribute("data-fls-watch", "");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  // Конструктор спостерігачів
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  // Функція створення налаштувань
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функція створення нового спостерігача зі своїми налаштуваннями
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функція ініціалізації спостерігача зі своїми налаштуваннями
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функція обробки базових дій точок спрацьовування
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  // Функція обробки спостереження
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
