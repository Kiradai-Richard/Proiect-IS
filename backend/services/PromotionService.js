const PromotionRepository = require('../repositories/PromotionRepository');

const promotionRepo = new PromotionRepository();

class PromotionService {
  async getActive() {
    return (await promotionRepo.findActive()).map(p => p.toJSON());
  }

  async getAll(user) {
    if (!user.canHandleOrders()) throw new Error('Acces interzis');
    return (await promotionRepo.findAll()).map(p => p.toJSON());
  }

  async create(data, user) {
    if (!user.canManagePromotions()) throw new Error('Acces interzis');
    if (!data.name || !data.product_id) throw new Error('Campuri obligatorii lipsa');
    const promo = await promotionRepo.create({
      name: data.name,
      product_id: data.product_id,
      discount_percent: data.discount_percent || 10,
      active: 1,
      created_by: user.id,
    });
    return promo.toJSON();
  }

  async delete(id, user) {
    if (!user.canManagePromotions()) throw new Error('Acces interzis');
    await promotionRepo.delete(id);
  }
}

module.exports = new PromotionService();
