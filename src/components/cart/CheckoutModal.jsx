import React from "react";
import ST from "../../styles/styles";

export default function CheckoutModal({
  cart,
  cartTotal,
  user,
  loading,
  onConfirm,
  onClose,
}) {
  return (
    <div style={ST.modal} onClick={onClose}>
      <div style={ST.mContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>📦 Confirmare comanda</h3>
        <p style={{ color: "#888", fontSize: 13 }}>
          Comanda va fi trimisa pe datele contului tau ({user?.email}).
        </p>

        {/* Lista produse din comanda */}
        <div
          style={{
            background: "#0d0d14",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          {cart.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                fontSize: 13,
                color: c.isPromoDiscount ? "#2ecc71" : "#ccc",
              }}
            >
              <span>
                {c.isPromoDiscount ? "🏷️ " : ""}
                {c.name} {!c.isPromoDiscount ? `x${c.qty}` : ""}
              </span>
              <span>
                {(c.isPromoDiscount
                  ? c.price
                  : c.price * c.qty
                ).toLocaleString()}{" "}
                Lei
              </span>
            </div>
          ))}

          {/* Total */}
          <div
            style={{
              borderTop: "1px solid #2a2a4a",
              marginTop: 8,
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 900,
              color: "#FF6B35",
            }}
          >
            <span>Total</span>
            <span>{cartTotal.toLocaleString()} Lei</span>
          </div>
        </div>

        {/* Butoane */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              ...ST.btn,
              flex: 1,
              padding: "12px",
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "..." : "💳 Plaseaza comanda"}
          </button>
          <button
            style={{ ...ST.btnSec, flex: 1, padding: "12px" }}
            onClick={onClose}
          >
            Anuleaza
          </button>
        </div>
      </div>
    </div>
  );
}
