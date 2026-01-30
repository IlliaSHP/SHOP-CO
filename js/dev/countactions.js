const countActionsContainers = document.querySelectorAll("[data-fls-countactions]");
countActionsContainers.forEach((container) => {
  const quantityInput = container.querySelector("[data-count-quantity]");
  const plusButton = container.querySelector("[data-count-plus]");
  const minusButton = container.querySelector("[data-count-minus]");
  if (!quantityInput || !plusButton || !minusButton) return;
  function getQuantity() {
    const value = parseInt(quantityInput.value) || 1;
    return Math.max(1, value);
  }
  function setQuantity(value) {
    const newValue = Math.max(1, parseInt(value) || 1);
    const max = parseInt(quantityInput.getAttribute("max")) || 99;
    quantityInput.value = Math.min(newValue, max);
  }
  plusButton.addEventListener("click", function(e) {
    e.preventDefault();
    const currentQuantity = getQuantity();
    const max = parseInt(quantityInput.getAttribute("max")) || 99;
    if (currentQuantity < max) {
      setQuantity(currentQuantity + 1);
    }
  });
  minusButton.addEventListener("click", function(e) {
    e.preventDefault();
    const currentQuantity = getQuantity();
    if (currentQuantity > 1) {
      setQuantity(currentQuantity - 1);
    }
  });
  quantityInput.addEventListener("keydown", function(e) {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ];
    if (allowedKeys.includes(e.key)) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  });
  quantityInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^\d]/g, "");
    const value = parseInt(this.value) || 1;
    const min = parseInt(this.getAttribute("min")) || 1;
    const max = parseInt(this.getAttribute("max")) || 999;
    if (value < min) this.value = min;
    if (value > max) this.value = max;
  });
  quantityInput.addEventListener("blur", function() {
    if (!this.value || parseInt(this.value) < 1) {
      this.value = 1;
    }
  });
});
