class Promotion {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.productId = data.product_id;
    this.productName = data.product_name || null;
    this.discountPercent = data.discount_percent || 10;
    this.active = data.active !== undefined ? Boolean(data.active) : true;
    this.createdBy = data.created_by;
    this.createdAt = data.created_at;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      productId: this.productId,
      productName: this.productName,
      discountPercent: this.discountPercent,
      active: this.active,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}

module.exports = { Promotion };
