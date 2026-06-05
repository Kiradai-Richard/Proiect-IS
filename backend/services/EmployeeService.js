const UserRepository = require('../repositories/UserRepository');

const userRepo = new UserRepository();

class EmployeeService {
  async getAll(user) {
    if (!user.canHandleOrders()) throw new Error('Acces interzis');
    return (await userRepo.findAllStaff()).map(u => u.toJSON());
  }

  async getById(id, user) {
    if (!user.canHandleOrders()) throw new Error('Acces interzis');
    const emp = await userRepo.findById(id);
    if (!emp) throw new Error('Angajat negasit');
    return emp.toJSON();
  }

  async update(id, data, user) {
    if (!user.canManageEmployees()) throw new Error('Acces interzis');
    const emp = await userRepo.update(id, data);
    return emp.toJSON();
  }

  async deactivate(id, user) {
    if (!user.canManageEmployees()) throw new Error('Acces interzis');
    await userRepo.update(id, { active: 0 });
  }

  async getStats(user) {
    if (!user.canViewStats()) throw new Error('Acces interzis');
    const total  = await userRepo.count({ role: 'employee' });
    const active = await userRepo.rawQuery("SELECT COUNT(*) AS cnt FROM users WHERE role='employee' AND active=1");
    return { total, active: active[0].cnt };
  }
}

module.exports = new EmployeeService();
