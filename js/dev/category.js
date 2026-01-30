import "./main.min.js";
import "./colorpicker.min.js";
import { d as dataMediaQueries, e as slideToggle, b as slideUp } from "./common.min.js";
import "./productcard.min.js";
import "./breadcrumb.min.js";
function spollers() {
  const spollersArray = document.querySelectorAll("[data-fls-spollers]");
  if (spollersArray.length > 0) {
    let initSpollers = function(spollersArray2, matchMedia = false) {
      spollersArray2.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("--spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("--spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }, initSpollerBody = function(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("--spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("--spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }, setSpollerAction = function(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
          const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
          const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll(".--slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }
            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
              spollerBlock.open = false;
            }, spollerSpeed);
            spollerTitle.classList.toggle("--spoller-active");
            slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
              const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth"
                }
              );
            }
          }
        }
      }
      if (!el.closest("[data-fls-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-fls-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("--spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
              spollerClose.classList.remove("--spoller-active");
              slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }, hideSpollersBody = function(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
        spollerActiveTitle.classList.remove("--spoller-active");
        slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    };
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
      return !item.dataset.flsSpollers.split(",")[0];
    });
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
}
window.addEventListener("load", spollers);
class PriceRangeSlider {
  constructor(element) {
    this.container = element;
    this.minInput = this.container.querySelector(".filter-price__input--min");
    this.maxInput = this.container.querySelector(".filter-price__input--max");
    this.progress = this.container.querySelector(".filter-price__progress");
    this.track = this.container.querySelector(".filter-price__track");
    const values = this.container.querySelectorAll(".filter-price__value");
    this.minValue = values[0];
    this.maxValue = values[1];
    if (!this.minValue) {
      this.minValue = this.container.querySelector('output[for="price-min"]');
    }
    if (!this.maxValue) {
      this.maxValue = this.container.querySelector('output[for="price-max"]');
    }
    if (!this.minInput || !this.maxInput) {
      console.error("Price range inputs not found!");
      return;
    }
    this.init();
  }
  init() {
    this.updateProgress();
    this.updateValues();
    this.bindEvents();
  }
  bindEvents() {
    this.minInput.addEventListener("input", () => this.handleMinInput());
    this.maxInput.addEventListener("input", () => this.handleMaxInput());
    this.minInput.addEventListener("change", () => this.handleMinInput());
    this.maxInput.addEventListener("change", () => this.handleMaxInput());
    this.track.addEventListener("click", (e) => this.handleTrackClick(e));
  }
  handleMinInput() {
    let minVal = parseInt(this.minInput.value);
    let maxVal = parseInt(this.maxInput.value);
    if (minVal > maxVal - 10) {
      this.minInput.value = maxVal - 10;
      minVal = maxVal - 10;
    }
    this.updateProgress();
    this.updateValues();
  }
  handleMaxInput() {
    let minVal = parseInt(this.minInput.value);
    let maxVal = parseInt(this.maxInput.value);
    if (maxVal < minVal + 10) {
      this.maxInput.value = minVal + 10;
      maxVal = minVal + 10;
    }
    this.updateProgress();
    this.updateValues();
  }
  handleTrackClick(e) {
    const trackRect = this.track.getBoundingClientRect();
    const clickPosition = (e.clientX - trackRect.left) / trackRect.width;
    const min = parseInt(this.minInput.min);
    const max = parseInt(this.minInput.max);
    const clickValue = Math.round(min + (max - min) * clickPosition);
    const currentMin = parseInt(this.minInput.value);
    const currentMax = parseInt(this.maxInput.value);
    const distanceToMin = Math.abs(clickValue - currentMin);
    const distanceToMax = Math.abs(clickValue - currentMax);
    if (distanceToMin < distanceToMax) {
      if (clickValue < currentMax - 10) {
        this.minInput.value = clickValue;
        this.handleMinInput();
      }
    } else {
      if (clickValue > currentMin + 10) {
        this.maxInput.value = clickValue;
        this.handleMaxInput();
      }
    }
  }
  updateProgress() {
    const min = parseInt(this.minInput.min);
    const max = parseInt(this.minInput.max);
    const minVal = parseInt(this.minInput.value);
    const maxVal = parseInt(this.maxInput.value);
    const leftPercent = (minVal - min) / (max - min) * 100;
    const rightPercent = (maxVal - min) / (max - min) * 100;
    this.progress.style.left = `${leftPercent}%`;
    this.progress.style.right = `${100 - rightPercent}%`;
  }
  updateValues() {
    const minVal = parseInt(this.minInput.value);
    const maxVal = parseInt(this.maxInput.value);
    if (this.minValue) {
      this.minValue.textContent = `$${minVal}`;
    } else {
      console.warn("minValue element not found");
    }
    if (this.maxValue) {
      this.maxValue.textContent = `$${maxVal}`;
    } else {
      console.warn("maxValue element not found");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const priceRanges = document.querySelectorAll("[data-fls-pricerange]");
  priceRanges.forEach((range) => {
    new PriceRangeSlider(range);
  });
});
class MobileFilters {
  constructor() {
    this.filterPanel = document.querySelector(".filters-panel");
    this.openBtn = document.querySelector("[data-open-filter]");
    this.closeBtn = document.querySelector(".filters-panel__close");
    this.overlay = null;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.touchStartX = 0;
    this.isDragging = false;
    this.isScrolling = false;
    this.startScrollTop = 0;
    if (!this.filterPanel) return;
    this.init();
  }
  init() {
    this.createOverlay();
    this.bindEvents();
  }
  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "filters-overlay";
    document.body.appendChild(this.overlay);
  }
  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
    this.overlay.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.filterPanel.classList.contains("--active")) {
        this.close();
      }
    });
    this.bindSwipeGestures();
    this.filterPanel.addEventListener("touchmove", (e) => {
      if (this.filterPanel.classList.contains("--active")) {
        e.stopPropagation();
      }
    }, { passive: true });
  }
  bindSwipeGestures() {
    this.filterPanel.addEventListener("touchstart", (e) => {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartX = e.touches[0].clientX;
      this.startScrollTop = this.filterPanel.scrollTop;
      this.isDragging = false;
      this.isScrolling = false;
    }, { passive: true });
    this.filterPanel.addEventListener("touchmove", (e) => {
      if (this.isScrolling) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - this.touchStartY;
      const diffX = Math.abs(currentX - this.touchStartX);
      if (!this.isDragging && Math.abs(diffY) > 10) {
        if (diffY > 0 && this.filterPanel.scrollTop === 0) {
          this.isDragging = true;
        } else {
          this.isScrolling = true;
          return;
        }
      }
      if (diffX > Math.abs(diffY)) {
        this.isScrolling = true;
        return;
      }
      if (this.isDragging && diffY > 0 && window.innerWidth <= 550) {
        const resistance = 0.6;
        const translateY = diffY * resistance;
        this.filterPanel.style.transform = `translateY(${translateY}px)`;
        this.filterPanel.style.transition = "none";
      }
    }, { passive: true });
    this.filterPanel.addEventListener("touchend", (e) => {
      if (!this.isDragging) {
        this.isScrolling = false;
        return;
      }
      this.touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = this.touchEndY - this.touchStartY;
      this.filterPanel.style.transition = "";
      if (swipeDistance > 100 && window.innerWidth <= 550) {
        this.close();
      } else {
        this.filterPanel.style.transform = "";
      }
      this.isDragging = false;
      this.isScrolling = false;
    }, { passive: true });
  }
  open() {
    this.filterPanel.classList.add("--active");
    this.overlay.classList.add("--active");
    document.body.classList.add("filters-open");
    this.filterPanel.setAttribute("aria-hidden", "false");
    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }
  close() {
    this.filterPanel.classList.remove("--active");
    this.overlay.classList.remove("--active");
    document.body.classList.remove("filters-open");
    this.filterPanel.style.transform = "";
    this.filterPanel.style.transition = "";
    this.filterPanel.setAttribute("aria-hidden", "true");
    if (this.openBtn) {
      this.openBtn.focus();
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  window.mobileFilters = new MobileFilters();
});
