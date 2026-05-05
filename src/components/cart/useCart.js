import { useState, useCallback } from "react";
import { api } from "../../services/api";

export default function useCart(notify, fetchProducts) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pcg_cart")) || [];
    } catch {
      return [];
    }
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveCart = useCallback((c) => {
    setCart(c);
    localStorage.setItem("pcg_cart", JSON.stringify(c));
  }, []);

  const addToCart = useCallback((product, promo, user) => {
    if (!user) {
      notify("Trebuie sa te autentifici pentru a comanda.", "error");
      return false; // signals caller to redirect to login
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id && !c.isPromoDiscount);
      let nc;

      if (existing) {
        if (existing.qty >= product.stock) {
          notify("Stoc insuficient!", "error");
          return prev;
        }
        nc = prev.map((c) =>
          c.id === product.id && !c.isPromoDiscount
            ? { ...c, qty: c.qty + 1 }
            : c
        );
      } else {
        nc = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: product.stock,
            image: product.image,
            specs: product.specs,
            qty: 1,
            isPromoDiscount: false,
          },
        ];
      }

      // Daca produsul are promotie, adauga articolul special cu pret negativ
      if (promo) {
        const promoKey = `promo_${product.id}`;
        const existingPromo = nc.find((c) => c.promoKey === promoKey);
        const itemInCart = nc.find(
          (c) => c.id === product.id && !c.isPromoDiscount
        );
        const discountTotal = -(Number(product.price) * itemInCart.qty * 0.1);

        if (existingPromo) {
          nc = nc.map((c) =>
            c.promoKey === promoKey ? { ...c, price: discountTotal } : c
          );
        } else {
          nc.push({
            id: `promo_${product.id}`,
            promoKey,
            name: `Promotie: ${promo.name} (-10%)`,
            price: discountTotal,
            qty: 1,
            isPromoDiscount: true,
            linkedProductId: product.id,
            image: product.image,
          });
        }
      }

      localStorage.setItem("pcg_cart", JSON.stringify(nc));
      notify(`${product.name} adaugat!`);
      return nc;
    });

    return true;
  }, [notify]);

  const removeFromCart = useCallback((item) => {
    setCart((prev) => {
      let nc = prev.filter(
        (c) => c.id !== item.id || c.isPromoDiscount !== item.isPromoDiscount
      );
      // Daca stergem un produs, stergem si discountul legat de el
      if (!item.isPromoDiscount) {
        nc = nc.filter((c) => c.linkedProductId !== item.id);
      }
      localStorage.setItem("pcg_cart", JSON.stringify(nc));
      return nc;
    });
  }, []);

  const updateQty = useCallback((id, delta, products) => {
    setCart((prev) => {
      let nc = prev.map((c) => {
        if (c.id !== id || c.isPromoDiscount) return c;
        const nq = c.qty + delta;
        if (nq < 1 || nq > c.stock) return c;
        return { ...c, qty: nq };
      });

      // Recalculeaza discountul promotiei daca exista
      const updated = nc.find((c) => c.id === id && !c.isPromoDiscount);
      if (updated) {
        const originalPrice = products.find((p) => p.id === id)?.price || 0;
        nc = nc.map((c) =>
          c.linkedProductId === id
            ? { ...c, price: -(Number(originalPrice) * updated.qty * 0.1) }
            : c
        );
      }

      localStorage.setItem("pcg_cart", JSON.stringify(nc));
      return nc;
    });
  }, []);

  const cartTotal = cart.reduce(
    (s, c) => s + (c.isPromoDiscount ? c.price : c.price * c.qty),
    0
  );

  const cartCount = cart
    .filter((c) => !c.isPromoDiscount)
    .reduce((s, c) => s + c.qty, 0);

  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      const items = cart.map((c) =>
        c.isPromoDiscount
          ? {
              item_name: c.name,
              price: c.price,
              quantity: 1,
              is_promo_discount: true,
            }
          : { product_id: c.id, quantity: c.qty }
      );
      await api("/orders/purchase", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      saveCart([]);
      setShowCheckout(false);
      notify("Comanda plasata cu succes!");
      if (fetchProducts) fetchProducts();
      return true;
    } catch (e) {
      notify(e.message, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }, [cart, saveCart, notify, fetchProducts]);

  return {
    cart,
    cartTotal,
    cartCount,
    showCheckout,
    setShowCheckout,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
    handleCheckout,
    saveCart,
  };
}
