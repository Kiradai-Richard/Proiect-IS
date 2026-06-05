function formatDateField(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).split('T')[0];
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

class Order {
  constructor(data) {
    if (new.target === Order) throw new Error('Order este abstract');
    this.id = data.id;
    this.ticketNumber = data.ticket_number ?? null;
    this.userId = data.user_id;
    this.orderType = data.order_type;
    this.customerName = data.customer_name;
    this.customerEmail = data.customer_email;
    this.customerPhone = data.customer_phone;
    this.customerAddress = data.customer_address;
    this.total = data.total ? Number(data.total) : 0;
    this.status = data.status || 'pending';
    this.serviceDescription = data.service_description || null;
    this.serviceDate = data.service_date || null;
    this.handledBy = data.handled_by || null;
    this.notes = data.notes || null;
    this.items = data.items || [];
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      ticketNumber: this.ticketNumber,
      userId: this.userId,
      orderType: this.orderType,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      customerAddress: this.customerAddress,
      total: this.total,
      status: this.status,
      serviceDescription: this.serviceDescription,
      serviceDate: formatDateField(this.serviceDate),
      handledBy: this.handledBy,
      notes: this.notes,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static create(data) {
    switch (data.order_type) {
      case 'purchase': return new PurchaseOrder(data);
      case 'service':  return new ServiceOrder(data);
      default: throw new Error(`Tip comanda necunoscut: ${data.order_type}`);
    }
  }
}

class PurchaseOrder extends Order {
  constructor(data) { super({ ...data, order_type: 'purchase' }); }
  canBeCancelled() { return this.status === 'pending'; }
}

class ServiceOrder extends Order {
  constructor(data) { super({ ...data, order_type: 'service' }); }
  getScheduledDate() { return this.serviceDate; }
}

module.exports = { Order, PurchaseOrder, ServiceOrder };
