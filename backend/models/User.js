class User {
  #password;

  constructor(data) {
    if (new.target === User) throw new Error('User este abstract');
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.#password = data.password;
    this.role = data.role;
    this.level = data.level || null;
    this.department = data.department || null;
    this.phone = data.phone || null;
    this.address = data.address || null;
    this.startDate = data.start_date || null;
    this.active = data.active !== undefined ? Boolean(data.active) : true;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  getPassword() { return this.#password; }

  canManageEmployees() { return false; }
  canManageProducts()  { return false; }
  canDeleteProducts()  { return false; }
  canManagePromotions(){ return false; }
  canHandleOrders()    { return false; }
  canViewStats()       { return false; }
  canPlaceOrders()     { return false; }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      level: this.level,
      department: this.department,
      phone: this.phone,
      address: this.address,
      startDate: this.startDate,
      active: this.active,
      createdAt: this.createdAt,
    };
  }

  static create(data) {
    switch (data.role) {
      case 'manager':  return new Manager(data);
      case 'employee': return data.level === 'senior' ? new SeniorEmployee(data) : new JuniorEmployee(data);
      case 'client':   return new Client(data);
      default: throw new Error(`Rol necunoscut: ${data.role}`);
    }
  }
}

class Manager extends User {
  constructor(data) { super({ ...data, role: 'manager' }); }
  canManageEmployees() { return true; }
  canManageProducts()  { return true; }
  canDeleteProducts()  { return true; }
  canManagePromotions(){ return true; }
  canHandleOrders()    { return true; }
  canViewStats()       { return true; }
}

class SeniorEmployee extends User {
  constructor(data) { super({ ...data, role: 'employee', level: 'senior' }); }
  canManageProducts()  { return true; }
  canManagePromotions(){ return true; }
  canHandleOrders()    { return true; }
  canViewStats()       { return true; }
}

class JuniorEmployee extends User {
  constructor(data) { super({ ...data, role: 'employee', level: 'junior' }); }
  canHandleOrders() { return true; }
}

class Client extends User {
  constructor(data) { super({ ...data, role: 'client' }); }
  canPlaceOrders() { return true; }
}

module.exports = { User, Manager, SeniorEmployee, JuniorEmployee, Client };
