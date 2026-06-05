const ProductRepository = require('../repositories/ProductRepository');

const productRepo = new ProductRepository();

class ProductService {
  async getAll(filters = {}) {
    return productRepo.findAll(filters);
  }

  async getById(id) {
    const product = await productRepo.findById(id);
    if (!product) throw new Error('Produs negasit');
    return product;
  }

  async create(data, user) {
    if (!user.canManageProducts()) throw new Error('Acces interzis');
    const product = await productRepo.create({
      name: data.name,
      category_id: data.category_id,
      product_type: data.product_type || 'component',
      price: data.price,
      stock: data.stock || 0,
      description: data.description || '',
      specs: data.specs ? JSON.stringify(data.specs) : '{}',
      image: data.image || '',
      rating: data.rating || 0,
      active: 1,
    });
    return product;
  }

  async update(id, data, user) {
    if (!user.canManageProducts()) throw new Error('Acces interzis');
    return productRepo.update(id, data);
  }

  async delete(id, user) {
    if (!user.canDeleteProducts()) throw new Error('Acces interzis');
    await productRepo.delete(id);
  }

  async getCategories() {
    return productRepo.rawQuery('SELECT * FROM categories ORDER BY id');
  }
}

module.exports = new ProductService();
