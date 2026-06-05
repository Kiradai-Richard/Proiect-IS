class Product {
  constructor(data) {
    if (new.target === Product) throw new Error('Product este abstract');
    this.id = data.id;
    this.name = data.name;
    this.categoryId = data.category_id;
    this.categoryName = data.category_name || null;
    this.categorySlug = data.category_slug || null;
    this.productType = data.product_type;
    this.price = Number(data.price);
    this.stock = data.stock;
    this.description = data.description || '';
    this.specs = data.specs ? (typeof data.specs === 'string' ? JSON.parse(data.specs) : data.specs) : {};
    this.image = data.image || '';
    this.rating = data.rating || 0;
    this.active = data.active !== undefined ? Boolean(data.active) : true;
    this.createdAt = data.created_at;
  }

  getInstallments() { return Math.floor(this.price / 4); }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      categorySlug: this.categorySlug,
      productType: this.productType,
      price: this.price,
      stock: this.stock,
      description: this.description,
      specs: this.specs,
      image: this.image,
      rating: this.rating,
      active: this.active,
      installments: this.getInstallments(),
      createdAt: this.createdAt,
    };
  }

  static create(data) {
    switch (data.product_type) {
      case 'system':    return new PrebuiltSystem(data);
      case 'component': return new Component(data);
      default: throw new Error(`Tip produs necunoscut: ${data.product_type}`);
    }
  }
}

class PrebuiltSystem extends Product {
  constructor(data) { super({ ...data, product_type: 'system' }); }
  getWarranty() { return '2 ani'; }
}

class Component extends Product {
  constructor(data) { super({ ...data, product_type: 'component' }); }
  getCompatibilityNotes() { return this.specs?.compatibility || ''; }
}

module.exports = { Product, PrebuiltSystem, Component };
