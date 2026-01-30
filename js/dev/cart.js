import "./main.min.js";
import "./countactions.min.js";
import "./breadcrumb.min.js";
import "./common.min.js";
const cartList = document.querySelector("[data-cart-list]");
if (cartList) {
  cartList.addEventListener("click", function(e) {
    const removeButton = e.target.closest("[data-cart-remove]");
    if (!removeButton) return;
    const cartItem = removeButton.closest("[data-cart-item]");
    if (!cartItem) return;
    cartItem.classList.add("is-removing");
    setTimeout(() => {
      cartItem.remove();
    }, 300);
  });
}
