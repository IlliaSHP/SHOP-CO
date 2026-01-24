import "./main.min.js";
import "./common.min.js";
const toggleActiveClass = (selector, activeClass = "active") => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", function(e) {
      e.preventDefault();
      this.classList.toggle(activeClass);
    });
  });
};
const setSingleActive = (selector, activeClass = "active") => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    el.addEventListener("click", function(e) {
      e.preventDefault();
      elements.forEach((item) => item.classList.remove(activeClass));
      this.classList.add(activeClass);
    });
  });
};
setSingleActive(".size-content-product__button", "size-content-product__button--active");
toggleActiveClass(".actions-content-product__button--favorite", "actions-content-product__button--favorite--active");
toggleActiveClass(".icons-product-sliders__favorite", "icons-product-sliders__favorite--active");
toggleActiveClass(".actions-content-product__button.button--second", "actions-content-product__button--active");
const countActionsContainers = document.querySelectorAll("[data-fls-countactions]");
countActionsContainers.forEach((container) => {
  const quantityInput = container.querySelector("[data-count-quantity]");
  const plusButton = container.querySelector("[data-count-plus]");
  const minusButton = container.querySelector("[data-count-minus]");
  if (!quantityInput || !plusButton || !minusButton) return;
  function getQuantity() {
    let quantity = parseInt(quantityInput.textContent.trim()) || 1;
    return Math.max(1, quantity);
  }
  function setQuantity(value) {
    value = Math.max(1, parseInt(value) || 1);
    quantityInput.textContent = value;
  }
  plusButton.addEventListener("click", function(e) {
    e.preventDefault();
    const currentQuantity = getQuantity();
    setQuantity(currentQuantity + 1);
  });
  minusButton.addEventListener("click", function(e) {
    e.preventDefault();
    const currentQuantity = getQuantity();
    if (currentQuantity > 1) {
      setQuantity(currentQuantity - 1);
    }
  });
  quantityInput.addEventListener("blur", function() {
    let value = parseInt(this.textContent.trim()) || 1;
    this.textContent = Math.max(1, value);
    updatePrice();
  });
  quantityInput.addEventListener("input", function() {
    this.textContent = this.textContent.replace(/[^0-9]/g, "");
  });
  updatePrice();
});
