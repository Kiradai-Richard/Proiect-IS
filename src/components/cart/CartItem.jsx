import React from "react";
import ST from "../../styles/styles";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: item.isPromoDiscount ? "12px" : "12px 0",
        borderBottom: "1px solid #1a1a30",
        flexWrap: "wrap",
        background: item.isPromoDiscount ? "#0d2818" : "transparent",
        borderRadius: item.isPromoDiscount ? 8 : 0,
      }}
    >
      {/* Imagine produs */}
      {item.image && (
        <img
          src={item.image}
          alt=""
          style={{
            width: 60,
            height: 45,
            borderRadius: 6,
            objectFit: "cover",
          }}
        />
      )}

      {/* Nume produs sau promotie */}
      <div style={{ flex: 1, minWidth: 150 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: item.isPromoDiscount ? "#2ecc71" : "#e0e0e0",
          }}
        >
          {item.isPromoDiscount ? "🏷️ " : ""}
          {item.name}
        </div>
      </div>

      {/* Butoane cantitate (doar pentru produse, nu pentru discount) */}
      {!item.isPromoDiscount && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => onUpdateQty(item.id, -1)}
            style={{
              background: "#1e1e3a",
              border: "none",
              color: "#fff",
              width: 26,
              height: 26,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            −
          </button>
          <span
            style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}
          >
            {item.qty}
          </span>
          <button
            onClick={() => onUpdateQty(item.id, 1)}
            style={{
              background: "#1e1e3a",
              border: "none",
              color: "#fff",
              width: 26,
              height: 26,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      )}

      {/* Pret */}
      <div
        style={{
          fontWeight: 900,
          color: item.isPromoDiscount ? "#2ecc71" : "#FF6B35",
          minWidth: 100,
          textAlign: "right",
        }}
      >
        {(item.isPromoDiscount
          ? item.price
          : item.price * item.qty
        ).toLocaleString()}{" "}
        Lei
      </div>

      {/* Buton stergere */}
      <button
        onClick={() => onRemove(item)}
        style={{
          background: "none",
          border: "none",
          color: "#e74c3c",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        🗑️
      </button>
    </div>
  );
}
