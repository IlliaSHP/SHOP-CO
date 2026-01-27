import "./main.min.js";
import "./clients.min.js";
import { c as getDigFormat } from "./common.min.js";
function digitsCounter() {
  const animatedCounters = /* @__PURE__ */ new Set();
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-fls-digcounter]");
    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter2) => {
        if (digitsCounter2.hasAttribute("data-fls-digcounter-once") && animatedCounters.has(digitsCounter2)) return;
        if (digitsCounter2.hasAttribute("data-fls-digcounter-go")) return;
        const originalValue = digitsCounter2.innerHTML.trim();
        let suffix = null;
        let numberValue = originalValue;
        if (digitsCounter2.hasAttribute("data-fls-digcounter-suffix")) {
          suffix = digitsCounter2.getAttribute("data-fls-digcounter-suffix");
          if (originalValue.endsWith(suffix)) {
            numberValue = originalValue.slice(0, -suffix.length).trim();
          }
        }
        digitsCounter2.dataset.flsDigcounter = numberValue;
        const format = numberValue.includes(",") ? "," : " ";
        if (!digitsCounter2.dataset.flsDigcounterFormat) {
          digitsCounter2.dataset.flsDigcounterFormat = format;
        }
        if (digitsCounter2.hasAttribute("data-fls-digcounter-stabilization")) {
          stabilizeCounter(digitsCounter2, () => {
            setupCounterContent(digitsCounter2, suffix);
            digitsCounter2.setAttribute("data-fls-digcounter-go", "");
            digitsCountersAnimate(digitsCounter2, suffix);
          });
        } else {
          setupCounterContent(digitsCounter2, suffix);
          digitsCounter2.setAttribute("data-fls-digcounter-go", "");
          digitsCountersAnimate(digitsCounter2, suffix);
        }
        if (digitsCounter2.hasAttribute("data-fls-digcounter-once")) {
          animatedCounters.add(digitsCounter2);
        }
      });
    }
  }
  function setupCounterContent(digitsCounter2, suffix) {
    if (suffix) {
      digitsCounter2.innerHTML = `0${suffix}`;
    } else {
      digitsCounter2.innerHTML = `0`;
    }
  }
  function stabilizeCounter(digitsCounter2, callback) {
    let targetElement = digitsCounter2;
    if (digitsCounter2.hasAttribute("data-fls-digcounter-stabilize-target")) {
      const selector = digitsCounter2.getAttribute("data-fls-digcounter-stabilize-target");
      const customTarget = digitsCounter2.closest(selector);
      if (customTarget) {
        targetElement = customTarget;
      }
    }
    const parent = digitsCounter2.parentElement;
    const originalValue = digitsCounter2.innerHTML.trim();
    let suffix = null;
    if (digitsCounter2.hasAttribute("data-fls-digcounter-suffix")) {
      suffix = digitsCounter2.getAttribute("data-fls-digcounter-suffix");
    }
    if (suffix && !originalValue.endsWith(suffix)) {
      digitsCounter2.textContent = originalValue + suffix;
    }
    requestAnimationFrame(() => {
      void digitsCounter2.offsetWidth;
      const spanWidth = digitsCounter2.offsetWidth;
      const spanHeight = digitsCounter2.offsetHeight;
      const targetWidth = targetElement.offsetWidth;
      const targetHeight = targetElement.offsetHeight;
      const parentWidth = parent.offsetWidth;
      const parentHeight = parent.offsetHeight;
      if (spanWidth > 0) digitsCounter2.style.minWidth = `${spanWidth}px`;
      if (spanHeight > 0) digitsCounter2.style.minHeight = `${spanHeight}px`;
      if (targetElement !== digitsCounter2) {
        if (targetWidth > 0) targetElement.style.minWidth = `${targetWidth}px`;
        if (targetHeight > 0) targetElement.style.minHeight = `${targetHeight}px`;
      }
      if (parentWidth > 0) parent.style.minWidth = `${parentWidth}px`;
      if (parentHeight > 0) parent.style.minHeight = `${parentHeight}px`;
      callback();
      requestAnimationFrame(() => {
        digitsCounter2.classList.add("_digcounter-visible");
      });
    });
  }
  function digitsCountersAnimate(digitsCounter2, suffix) {
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
      const formattedValue = getDigFormat(value, format);
      digitsCounter2.innerHTML = suffix ? formattedValue + suffix : formattedValue;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        const finalValue = getDigFormat(startValue, format);
        digitsCounter2.innerHTML = suffix ? finalValue + suffix : finalValue;
        digitsCounter2.removeAttribute("data-fls-digcounter-go");
        if (digitsCounter2.hasAttribute("data-fls-digcounter-stabilization")) {
          let targetElement = digitsCounter2;
          if (digitsCounter2.hasAttribute("data-fls-digcounter-stabilize-target")) {
            const selector = digitsCounter2.getAttribute("data-fls-digcounter-stabilize-target");
            const customTarget = digitsCounter2.closest(selector);
            if (customTarget) {
              targetElement = customTarget;
            }
          }
          const parent = digitsCounter2.parentElement;
          digitsCounter2.style.minWidth = "";
          digitsCounter2.style.minHeight = "";
          if (targetElement !== digitsCounter2) {
            targetElement.style.minWidth = "";
            targetElement.style.minHeight = "";
          }
          parent.style.minWidth = "";
          parent.style.minHeight = "";
        }
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
const marquee = () => {
  const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
  const ATTR_NAMES = {
    inner: "data-fls-marquee-inner",
    item: "data-fls-marquee-item"
  };
  if (!$marqueeArray.length) return;
  const { head } = document;
  const debounce = (delay, fn) => {
    let timerId;
    return (...args) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  };
  const onWindowWidthResize = (cb) => {
    if (!cb && !isFunction(cb)) return;
    let prevWidth = 0;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth !== currentWidth) {
        prevWidth = currentWidth;
        cb();
      }
    };
    window.addEventListener("resize", debounce(50, handleResize));
    handleResize();
  };
  const buildMarquee = (marqueeNode) => {
    if (!marqueeNode) return;
    const $marquee = marqueeNode;
    const $childElements = $marquee.children;
    if (!$childElements.length) return;
    Array.from($childElements).forEach(($childItem) => $childItem.setAttribute(ATTR_NAMES.item, ""));
    const htmlStructure = `<div ${ATTR_NAMES.inner}>${$marquee.innerHTML}</div>`;
    $marquee.innerHTML = htmlStructure;
  };
  const getElSize = ($el, isVertical) => {
    if (isVertical) return $el.offsetHeight;
    return $el.offsetWidth;
  };
  $marqueeArray.forEach(($wrapper) => {
    if (!$wrapper) return;
    buildMarquee($wrapper);
    const $marqueeInner = $wrapper.firstElementChild;
    let cacheArray = [];
    if (!$marqueeInner) return;
    const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
    const $items = $wrapper.querySelectorAll(`[${ATTR_NAMES.item}]`);
    const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
    const isMousePaused = $wrapper.hasAttribute("data-fls-marquee-pause");
    const direction = $wrapper.getAttribute("data-fls-marquee-direction");
    const isVertical = direction === "bottom" || direction === "top";
    const animName = `marqueeAnimation-${Math.floor(Math.random() * 1e7)}`;
    let spaceBetweenItem = parseFloat(window.getComputedStyle($items[0])?.getPropertyValue("margin-right"));
    let spaceBetween = spaceBetweenItem !== null && spaceBetweenItem !== void 0 ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
    let startPosition = parseFloat($wrapper.getAttribute("data-fls-marquee-start")) || 0;
    let sumSize = 0;
    let firstScreenVisibleSize = 0;
    let initialSizeElements = 0;
    let initialElementsLength = $marqueeInner.children.length;
    let index = 0;
    let counterDuplicateElements = 0;
    const initEvents = () => {
      if (startPosition) $marqueeInner.addEventListener("animationiteration", onChangeStartPosition);
      if (!isMousePaused) return;
      $marqueeInner.removeEventListener("mouseenter", onChangePaused);
      $marqueeInner.removeEventListener("mouseleave", onChangePaused);
      $marqueeInner.addEventListener("mouseenter", onChangePaused);
      $marqueeInner.addEventListener("mouseleave", onChangePaused);
    };
    const onChangeStartPosition = () => {
      startPosition = 0;
      $marqueeInner.removeEventListener("animationiteration", onChangeStartPosition);
      onResize();
    };
    const setBaseStyles = (firstScreenVisibleSize2) => {
      let baseStyle = "display: flex; flex-wrap: nowrap;";
      if (isVertical) {
        baseStyle += `
				flex-direction: column;
				position: relative;
				will-change: transform;`;
        if (direction === "bottom") {
          baseStyle += `top: -${firstScreenVisibleSize2}px;`;
        }
      } else {
        baseStyle += `
				position: relative;
				will-change: transform;`;
        if (direction === "right") {
          baseStyle += `inset-inline-start: -${firstScreenVisibleSize2}px;;`;
        }
      }
      $marqueeInner.style.cssText = baseStyle;
    };
    const setdirectionAnim = (totalWidth) => {
      switch (direction) {
        case "right":
        case "bottom":
          return totalWidth;
        default:
          return -totalWidth;
      }
    };
    const animation = () => {
      const keyFrameCss = `@keyframes ${animName} {
					 0% {
						 transform: translate${isVertical ? "Y" : "X"}(${!isVertical && window.stateRtl ? -startPosition : startPosition}%);
					 }
					 100% {
						 transform: translate${isVertical ? "Y" : "X"}(${setdirectionAnim(
        !isVertical && window.stateRtl ? -firstScreenVisibleSize : firstScreenVisibleSize
      )}px);
					 }
				 }`;
      const $style = document.createElement("style");
      $style.classList.add(animName);
      $style.innerHTML = keyFrameCss;
      head.append($style);
      $marqueeInner.style.animation = `${animName} ${(firstScreenVisibleSize + startPosition * firstScreenVisibleSize / 100) / speed}s infinite linear`;
    };
    const addDublicateElements = () => {
      sumSize = firstScreenVisibleSize = initialSizeElements = counterDuplicateElements = index = 0;
      const $parentNodeWidth = getElSize($wrapper, isVertical);
      let $childrenEl = Array.from($marqueeInner.children);
      if (!$childrenEl.length) return;
      if (!cacheArray.length) {
        cacheArray = $childrenEl.map(($item) => $item);
      } else {
        $childrenEl = [...cacheArray];
      }
      $marqueeInner.style.display = "flex";
      if (isVertical) $marqueeInner.style.flexDirection = "column";
      $marqueeInner.innerHTML = "";
      $childrenEl.forEach(($item) => {
        $marqueeInner.append($item);
      });
      $childrenEl.forEach(($item) => {
        if (isVertical) {
          $item.style.marginBottom = `${spaceBetween}px`;
        } else {
          if (spaceBetweenItem === null || spaceBetweenItem === void 0) {
            $item.style.marginRight = `${spaceBetween}px`;
          }
          $item.style.flexShrink = 0;
        }
        const sizeEl = getElSize($item, isVertical);
        sumSize += sizeEl + spaceBetween;
        firstScreenVisibleSize += sizeEl + spaceBetween;
        initialSizeElements += sizeEl + spaceBetween;
        counterDuplicateElements += 1;
        return sizeEl;
      });
      const $multiplyWidth = $parentNodeWidth * 2 + initialSizeElements;
      for (; sumSize < $multiplyWidth; index += 1) {
        if (!$childrenEl[index]) index = 0;
        const $cloneNone = $childrenEl[index].cloneNode(true);
        const $lastElement = $marqueeInner.children[index];
        $marqueeInner.append($cloneNone);
        sumSize += getElSize($lastElement, isVertical) + spaceBetween;
        if (firstScreenVisibleSize < $parentNodeWidth || counterDuplicateElements % initialElementsLength !== 0) {
          counterDuplicateElements += 1;
          firstScreenVisibleSize += getElSize($lastElement, isVertical) + spaceBetween;
        }
      }
      setBaseStyles(firstScreenVisibleSize);
    };
    const correctSpaceBetween = () => {
      if (spaceBetweenItem !== null && spaceBetweenItem !== void 0) {
        $items.forEach(($item) => $item.style.removeProperty("margin-right"));
        spaceBetweenItem = parseFloat(window.getComputedStyle($items[0]).getPropertyValue("margin-right"));
        spaceBetween = spaceBetweenItem !== null && spaceBetweenItem !== void 0 ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
      }
    };
    const init = () => {
      correctSpaceBetween();
      addDublicateElements();
      animation();
      initEvents();
    };
    const onResize = () => {
      head.querySelector(`.${animName}`)?.remove();
      init();
    };
    const onChangePaused = (e) => {
      const { type, target } = e;
      target.style.animationPlayState = type === "mouseenter" ? "paused" : "running";
    };
    onWindowWidthResize(onResize);
  });
};
marquee();
