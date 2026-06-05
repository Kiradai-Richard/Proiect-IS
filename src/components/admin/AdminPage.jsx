import React, { useState, useCallback, useEffect } from 'react';
import ST from '../../styles/styles';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';
import { api, getUser, logout } from '../../services/api';

const ORDER_STATUSES   = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const SERVICE_STATUSES = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return <span className={`ap-badge ap-badge--${status}`}>{status}</span>;
}
function RoleBadge({ role }) {
  return <span className={`ap-badge ap-badge--${role}`}>{role}</span>;
}
function Notification({ notification }) {
  if (!notification) return null;
  return (
    <div className={notification.type === 'success' ? 'ap-toast ap-toast--success' : 'ap-toast ap-toast--error'}>
      {notification.type === 'success' ? '✓' : '✕'} {notification.msg}
    </div>
  );
}

// ─── Add Employee Modal ───────────────────────────────────────────────────────
function AddEmployeeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', level: 'junior', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Completati toate campurile obligatorii.'); return;
    }
    setLoading(true);
    try {
      const emp = await api('/auth/register-employee', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onAdd(emp);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ST.modal}>
      <div style={ST.mContent}>
        <div className="ap-modal-header">
          <h3 className="ap-modal-title">👤 Adauga Angajat</h3>
          <button style={ST.btnSec} onClick={onClose}>✕</button>
        </div>
        {error && <div style={ST.error}>{error}</div>}
        <label style={ST.label}>Nume complet *</label>
        <input style={ST.input} value={form.name}     onChange={e => set('name', e.target.value)}     placeholder="Ion Popescu" />
        <label style={ST.label}>Email *</label>
        <input style={ST.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ion@pcg.ro" />
        <label style={ST.label}>Telefon</label>
        <input style={ST.input} value={form.phone}    onChange={e => set('phone', e.target.value)}    placeholder="07xx xxx xxx" />
        <label style={ST.label}>Parola *</label>
        <input style={ST.input} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
        <label style={ST.label}>Nivel</label>
        <select style={ST.select} value={form.level} onChange={e => set('level', e.target.value)}>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>
        <div className="ap-role-hint">
          {form.level === 'senior'
            ? '⭐ Seniori pot adăuga produse/piese noi și pot onora comenzi/service-uri.'
            : '🔰 Juniorii pot onora comenzi și service-uri, dar nu pot adăuga produse.'}
        </div>
        <div className="ap-modal-actions">
          <button style={ST.btnSec} onClick={onClose}>Anulare</button>
          <button style={ST.btn}    onClick={submit} disabled={loading}>{loading ? '...' : 'Adauga angajat'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Status Modal ──────────────────────────────────────────────────────
function ChangeStatusModal({ item, type, employees, onClose, onSave }) {
  const statuses = type === 'order' ? ORDER_STATUSES : SERVICE_STATUSES;
  const [status,     setStatus]     = useState(item.status);
  const [assignedTo, setAssignedTo] = useState(item.handledBy || '');
  const [loading,    setLoading]    = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await onSave(item.id, status, assignedTo || null);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ST.modal}>
      <div style={{ ...ST.mContent, maxWidth: 440 }}>
        <div className="ap-modal-header">
          <h3 className="ap-modal-title--sm">
            {type === 'order' ? '📦 Actualizare Comanda' : '🔧 Actualizare Service'}
          </h3>
          <button style={ST.btnSec} onClick={onClose}>✕</button>
        </div>
        <div className="ap-modal-item-preview">
          <div className="ap-modal-item-label">{type === 'order' ? 'Comanda' : 'Tichet'}</div>
          <div className="ap-modal-item-id">#{item.id}</div>
          <div className="ap-modal-item-desc">
            {type === 'order' ? item.items?.map(i => i.item_name).join(', ') : item.serviceDescription}
          </div>
        </div>
        <label style={ST.label}>Status</label>
        <select style={ST.select} value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <label style={ST.label}>Atribuie angajat</label>
        <select style={ST.select} value={assignedTo} onChange={e => setAssignedTo(e.target.value ? Number(e.target.value) : '')}>
          <option value="">— Neatribuit —</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.level || emp.role})</option>
          ))}
        </select>
        <div className="ap-modal-actions">
          <button style={ST.btnSec} onClick={onClose}>Anulare</button>
          <button style={ST.btn} onClick={save} disabled={loading}>{loading ? '...' : 'Salveaza'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({ onClose, onAdd, categories }) {
  const [form, setForm]   = useState({ name: '', category_id: '', product_type: 'component', price: '', stock: '', image: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.category_id || !form.price || !form.stock) {
      setError('Completati toate campurile.'); return;
    }
    setLoading(true);
    try {
      const prod = await api('/products', {
        method: 'POST',
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) }),
      });
      onAdd(prod);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ST.modal}>
      <div style={{ ...ST.mContent, maxWidth: 480 }}>
        <div className="ap-modal-header">
          <h3 className="ap-modal-title">➕ Adauga Produs / Piesa</h3>
          <button style={ST.btnSec} onClick={onClose}>✕</button>
        </div>
        {error && <div style={ST.error}>{error}</div>}
        <label style={ST.label}>Denumire *</label>
        <input style={ST.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="ex: RTX 4090" />
        <label style={ST.label}>Categorie *</label>
        <select style={ST.select} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
          <option value="">Alege categorie</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={ST.label}>Tip</label>
        <select style={ST.select} value={form.product_type} onChange={e => set('product_type', e.target.value)}>
          <option value="component">Componenta</option>
          <option value="system">Sistem pre-asamblat</option>
        </select>
        <label style={ST.label}>Pret (Lei) *</label>
        <input style={ST.input} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
        <label style={ST.label}>Stoc *</label>
        <input style={ST.input} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
        <label style={ST.label}>URL Imagine</label>
        <input style={ST.input} value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/..." />
        <div className="ap-modal-actions">
          <button style={ST.btnSec} onClick={onClose}>Anulare</button>
          <button style={ST.btn}    onClick={submit} disabled={loading}>{loading ? '...' : 'Adauga produs'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Promotion Modal ──────────────────────────────────────────────────────
function AddPromoModal({ onClose, onAdd, products }) {
  const [form, setForm]   = useState({ name: '', product_id: '', discount_percent: 10 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.product_id) { setError('Completati toate campurile.'); return; }
    setLoading(true);
    try {
      const promo = await api('/promotions', {
        method: 'POST',
        body: JSON.stringify({ ...form, product_id: Number(form.product_id), discount_percent: Number(form.discount_percent) }),
      });
      onAdd(promo);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ST.modal}>
      <div style={{ ...ST.mContent, maxWidth: 440 }}>
        <div className="ap-modal-header">
          <h3 className="ap-modal-title">🏷️ Adauga Promotie</h3>
          <button style={ST.btnSec} onClick={onClose}>✕</button>
        </div>
        {error && <div style={ST.error}>{error}</div>}
        <label style={ST.label}>Nume promotie *</label>
        <input style={ST.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="ex: Super Discount" />
        <label style={ST.label}>Produs *</label>
        <select style={ST.select} value={form.product_id} onChange={e => set('product_id', e.target.value)}>
          <option value="">Alege produs</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <label style={ST.label}>Discount (%)</label>
        <input style={ST.input} type="number" min="1" max="99" value={form.discount_percent} onChange={e => set('discount_percent', e.target.value)} />
        <div className="ap-modal-actions">
          <button style={ST.btnSec} onClick={onClose}>Anulare</button>
          <button style={ST.btn}    onClick={submit} disabled={loading}>{loading ? '...' : 'Creeaza promotie'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardSection({ employees, orders, services, products, stats }) {
  const statCards = [
    { label: 'Angajati',           value: employees.length,                                                icon: '👥', color: '#9b59b6' },
    { label: 'Comenzi active',     value: orders.filter(o => ['pending','processing'].includes(o.status)).length, icon: '📦', color: '#FF6B35' },
    { label: 'Service-uri active', value: services.filter(s => ['pending','processing'].includes(s.status)).length, icon: '🔧', color: '#3498db' },
    { label: 'Produse in stoc',    value: products.reduce((a, p) => a + (p.stock || 0), 0), icon: '🖥️', color: '#2ecc71' },
  ];
  const pendingOrders   = orders.filter(o => o.status === 'pending');
  const pendingServices = services.filter(s => s.status === 'pending');

  return (
    <>
      <h3 className="ap-section-title" style={{ marginBottom: 20 }}>📊 Panou General</h3>
      {stats && (
        <div style={{ background: '#12121f', borderRadius: 8, padding: '12px 20px', marginBottom: 20, fontSize: 13, color: '#888', display: 'flex', gap: 30 }}>
          <span>Total comenzi: <strong style={{ color: '#FF6B35' }}>{stats.total}</strong></span>
          <span>Venituri: <strong style={{ color: '#2ecc71' }}>{Number(stats.revenue || 0).toLocaleString()} Lei</strong></span>
        </div>
      )}
      <div className="ap-stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="ap-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="ap-stat-icon">{s.icon}</div>
            <div className="ap-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="ap-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="ap-pending-grid">
        <div className="ap-pending-card">
          <h4 className="ap-pending-card-title">📦 Comenzi in asteptare ({pendingOrders.length})</h4>
          {pendingOrders.length === 0
            ? <p className="ap-text-muted" style={{ fontSize: 13 }}>Nicio comanda in asteptare.</p>
            : pendingOrders.map(o => (
                <div key={o.id} className="ap-pending-row">
                  <div>
                    <div className="ap-pending-row-name">{o.customerName}</div>
                    <div className="ap-pending-row-sub">#{o.id}</div>
                  </div>
                  <div className="ap-pending-row-amount">{Number(o.total).toLocaleString()} Lei</div>
                </div>
              ))
          }
        </div>
        <div className="ap-pending-card">
          <h4 className="ap-pending-card-title">🔧 Service-uri in asteptare ({pendingServices.length})</h4>
          {pendingServices.length === 0
            ? <p className="ap-text-muted" style={{ fontSize: 13 }}>Niciun service in asteptare.</p>
            : pendingServices.map(s => (
                <div key={s.id} className="ap-pending-row">
                  <div>
                    <div className="ap-pending-row-name">{s.serviceDescription?.substring(0, 50)}...</div>
                    <div className="ap-pending-row-sub">{s.customerName} · #{s.id}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))
          }
        </div>
      </div>
    </>
  );
}

// ─── Employees ────────────────────────────────────────────────────────────────
function EmployeesSection({ employees, setEmployees, notify, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search,  setSearch]  = useState('');

  if (currentUser.role !== 'manager') return (
    <div className="ap-locked"><div className="ap-locked-icon">🔒</div><p>Doar managerul poate gestiona angajatii.</p></div>
  );

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeactivate = async (id) => {
    try {
      await api(`/employees/${id}`, { method: 'DELETE' });
      setEmployees(prev => prev.filter(e => e.id !== id));
      notify('Angajat dezactivat.');
    } catch (e) { notify(e.message, 'error'); }
  };

  return (
    <>
      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onAdd={emp => { setEmployees(p => [...p, emp]); notify('Angajat adaugat!'); }}
        />
      )}
      <div className="ap-section-header">
        <h3 className="ap-section-title">👥 Angajati ({employees.length})</h3>
        <div className="ap-section-controls">
          <input className="ap-search-input" placeholder="🔍 Cauta…" value={search} onChange={e => setSearch(e.target.value)} />
          <button style={ST.btn} onClick={() => setShowAdd(true)}>+ Angajat nou</button>
        </div>
      </div>
      <div className="ap-table-wrap">
        <table style={ST.table}>
          <thead><tr>{['Angajat','Email','Telefon','Nivel','Data adaugare','Actiuni'].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(emp => (
              <tr key={emp.id}>
                <td style={ST.td}>
                  <div className="ap-emp-cell">
                    <div className={`ap-emp-avatar ap-emp-avatar--${emp.level || emp.role}`}>{emp.name.charAt(0)}</div>
                    <span className="ap-fw-600">{emp.name}</span>
                  </div>
                </td>
                <td style={ST.td} className="ap-text-muted">{emp.email}</td>
                <td style={ST.td} className="ap-text-muted">{emp.phone || '—'}</td>
                <td style={ST.td}><RoleBadge role={emp.level || emp.role} /></td>
                <td style={ST.td} className="ap-text-dim">{emp.createdAt?.split('T')[0] || '—'}</td>
                <td style={ST.td}>
                  <button style={ST.btnDanger} onClick={() => handleDeactivate(emp.id)}>Dezactiveaza</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Niciun angajat gasit.</div>}
      </div>
    </>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function OrdersSection({ orders, setOrders, employees, notify }) {
  const [modal,        setModal]        = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const handleSave = async (id, status, handledBy) => {
    try {
      const updated = await api(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, handled_by: handledBy }),
      });
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      notify('Comanda actualizata!');
    } catch (e) { notify(e.message, 'error'); }
  };

  return (
    <>
      {modal && (
        <ChangeStatusModal item={modal} type="order" employees={employees}
          onClose={() => setModal(null)} onSave={handleSave} />
      )}
      <div className="ap-section-header">
        <h3 className="ap-section-title">📦 Comenzi ({orders.length})</h3>
        <select className="ap-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Toate statusurile</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div className="ap-table-wrap">
        <table style={ST.table}>
          <thead><tr>{['ID','Client','Email','Total','Status','Data','Actiuni'].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td style={ST.td} className="ap-text-orange ap-fw-700">#{order.id}</td>
                <td style={ST.td}>{order.customerName}</td>
                <td style={ST.td} className="ap-text-muted">{order.customerEmail}</td>
                <td style={ST.td} className="ap-fw-700">{Number(order.total).toLocaleString()} Lei</td>
                <td style={ST.td}><StatusBadge status={order.status} /></td>
                <td style={ST.td} className="ap-text-dim">{order.createdAt?.split('T')[0]}</td>
                <td style={ST.td}><button style={ST.btn} onClick={() => setModal(order)}>Actualizeaza</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Nicio comanda gasita.</div>}
      </div>
    </>
  );
}

// ─── Service ──────────────────────────────────────────────────────────────────
function ServiceSection({ services, setServices, employees, notify }) {
  const [modal,        setModal]        = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? services : services.filter(s => s.status === filterStatus);

  const handleSave = async (id, status, handledBy) => {
    try {
      const updated = await api(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, handled_by: handledBy }),
      });
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      notify('Service actualizat!');
    } catch (e) { notify(e.message, 'error'); }
  };

  return (
    <>
      {modal && (
        <ChangeStatusModal item={modal} type="service" employees={employees}
          onClose={() => setModal(null)} onSave={handleSave} />
      )}
      <div className="ap-section-header">
        <h3 className="ap-section-title">🔧 Service ({services.length})</h3>
        <select className="ap-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Toate statusurile</option>
          {SERVICE_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div className="ap-table-wrap">
        <table style={ST.table}>
          <thead><tr>{['ID','Client','Descriere','Data service','Status','Actiuni'].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(srv => (
              <tr key={srv.id}>
                <td style={ST.td} className="ap-text-blue ap-fw-700">#{srv.id}</td>
                <td style={ST.td}>{srv.customerName}</td>
                <td style={{ ...ST.td, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }} className="ap-text-muted">
                  {srv.serviceDescription}
                </td>
                <td style={ST.td} className="ap-text-dim">{srv.serviceDate || '—'}</td>
                <td style={ST.td}><StatusBadge status={srv.status} /></td>
                <td style={ST.td}><button style={ST.btn} onClick={() => setModal(srv)}>Actualizeaza</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Niciun tichet gasit.</div>}
      </div>
    </>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
function ProductsSection({ products, setProducts, notify, currentUser, categories }) {
  const [showAdd, setShowAdd] = useState(false);
  const canAdd = currentUser.role === 'manager' || (currentUser.role === 'employee' && currentUser.level === 'senior');

  const handleDelete = async (id) => {
    try {
      await api(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      notify('Produs eliminat.');
    } catch (e) { notify(e.message, 'error'); }
  };

  return (
    <>
      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onAdd={prod => { setProducts(p => [...p, prod]); notify('Produs adaugat!'); }}
          categories={categories}
        />
      )}
      <div className="ap-section-header">
        <h3 className="ap-section-title">🖥️ Produse & Piese ({products.length})</h3>
        {canAdd
          ? <button style={ST.btn} onClick={() => setShowAdd(true)}>+ Produs nou</button>
          : <div style={ST.warning}>Doar seniori pot adauga produse.</div>
        }
      </div>
      <div className="ap-table-wrap">
        <table style={ST.table}>
          <thead><tr>{['Denumire','Categorie','Pret','Stoc','Actiuni'].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr></thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td style={ST.td} className="ap-fw-600">{prod.name}</td>
                <td style={ST.td}><span className="ap-category-chip">{prod.categoryName}</span></td>
                <td style={ST.td} className="ap-text-orange ap-fw-700">{Number(prod.price).toLocaleString()} Lei</td>
                <td style={ST.td} className={prod.stock < 3 ? 'ap-stock--low' : 'ap-stock--ok'}>{prod.stock}</td>
                <td style={ST.td}>
                  {currentUser.role === 'manager' && (
                    <button style={ST.btnDanger} onClick={() => handleDelete(prod.id)}>Elimina</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Promotions ───────────────────────────────────────────────────────────────
function PromotionsSection({ promotions, setPromotions, products, notify, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const canManage = currentUser.role === 'manager' || (currentUser.role === 'employee' && currentUser.level === 'senior');

  const handleDelete = async (id) => {
    try {
      await api(`/promotions/${id}`, { method: 'DELETE' });
      setPromotions(prev => prev.filter(p => p.id !== id));
      notify('Promotie stearsa.');
    } catch (e) { notify(e.message, 'error'); }
  };

  return (
    <>
      {showAdd && (
        <AddPromoModal
          onClose={() => setShowAdd(false)}
          onAdd={promo => { setPromotions(p => [...p, promo]); notify('Promotie creata!'); }}
          products={products}
        />
      )}
      <div className="ap-section-header">
        <h3 className="ap-section-title">🏷️ Promotii ({promotions.length})</h3>
        {canManage
          ? <button style={ST.btn} onClick={() => setShowAdd(true)}>+ Promotie noua</button>
          : <div style={ST.warning}>Doar seniori pot gestiona promotiile.</div>
        }
      </div>
      <div className="ap-table-wrap">
        <table style={ST.table}>
          <thead><tr>{['Nume','Produs','Discount','Status','Actiuni'].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr></thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td style={ST.td} className="ap-fw-600">{promo.name}</td>
                <td style={ST.td} className="ap-text-muted">{promo.productName}</td>
                <td style={ST.td} className="ap-text-orange ap-fw-700">-{promo.discountPercent}%</td>
                <td style={ST.td}>{promo.active ? <span style={{ color: '#2ecc71' }}>Activa</span> : <span style={{ color: '#e74c3c' }}>Inactiva</span>}</td>
                <td style={ST.td}>
                  {canManage && (
                    <button style={ST.btnDanger} onClick={() => handleDelete(promo.id)}>Sterge</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promotions.length === 0 && <div className="ap-empty">Nicio promotie activa.</div>}
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [notification,  setNotification]  = useState(null);
  const [employees,     setEmployees]      = useState([]);
  const [orders,        setOrders]         = useState([]);
  const [services,      setServices]       = useState([]);
  const [products,      setProducts]       = useState([]);
  const [promotions,    setPromotions]     = useState([]);
  const [categories,    setCategories]     = useState([]);
  const [stats,         setStats]          = useState(null);
  const [loading,       setLoading]        = useState(true);

  const notify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'client') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        const [emps, prods, cats, ords, srvs, promos, st] = await Promise.all([
          api('/employees'),
          api('/products'),
          api('/products/categories'),
          api('/orders?type=purchase'),
          api('/orders?type=service'),
          api('/promotions'),
          api('/orders/stats'),
        ]);
        setEmployees(emps);
        setProducts(prods);
        setCategories(cats);
        setOrders(ords);
        setServices(srvs);
        setPromotions(promos);
        setStats(st);
      } catch (e) {
        notify(e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!currentUser || currentUser.role === 'client') return null;

  const sidebarItems = [
    { id: 'dashboard',  label: 'Panou General',  icon: '📊' },
    { id: 'orders',     label: 'Comenzi',         icon: '📦' },
    { id: 'service',    label: 'Service',          icon: '🔧' },
    { id: 'products',   label: 'Produse & Piese',  icon: '🖥️' },
    { id: 'promotions', label: 'Promotii',         icon: '🏷️' },
    ...(currentUser.role === 'manager' ? [{ id: 'employees', label: 'Angajati', icon: '👥' }] : []),
  ];

  const canManagePromos = currentUser.role === 'manager' ||
    (currentUser.role === 'employee' && currentUser.level === 'senior');

  const permissions = [
    { label: 'Gestioneaza angajati',  allowed: currentUser.role === 'manager' },
    { label: 'Adauga produse',        allowed: currentUser.role === 'manager' || currentUser.level === 'senior' },
    { label: 'Gestioneaza promotii',  allowed: canManagePromos },
    { label: 'Onoreaza comenzi',      allowed: true },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={ST.app}>
      <Notification notification={notification} />

      <div style={ST.header}>
        <div style={ST.headerTop}>
          <div style={ST.logo}>PCG Admin</div>
          <div className="ap-header-right-side">
            <div className="ap-header-user">
              <div className="ap-header-user-info">
                <div className="ap-header-user-name">{currentUser.name}</div>
                <div className="ap-header-user-role">
                  <RoleBadge role={currentUser.role === 'employee' ? (currentUser.level || 'employee') : currentUser.role} />
                </div>
              </div>
              <div className="ap-header-avatar">{currentUser.name.charAt(0)}</div>
            </div>
            <div className="ap-header-button-main-page" style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...ST.btn, padding: '10px 12px', fontSize: 14 }} onClick={() => navigate('/')}>
                Home
              </button>
              <button style={{ ...ST.btnSec, padding: '10px 12px', fontSize: 14 }} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>Se incarca datele...</div>
      ) : (
        <div className="ap-body">
          <div style={ST.sidebar}>
            {sidebarItems.map(item => (
              <div
                key={item.id}
                style={{ ...ST.sideItem, ...(activeSection === item.id ? ST.sideActive : {}) }}
                onClick={() => setActiveSection(item.id)}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
            <div className="ap-permissions-box">
              <div className="ap-permissions-title">Permisiuni</div>
              {permissions.map(p => (
                <div key={p.label} className="ap-permission-row">
                  <span className={p.allowed ? 'ap-permission-row--allowed' : 'ap-permission-row--denied'}>
                    {p.allowed ? '✓' : '✕'}
                  </span>
                  {p.label}
                </div>
              ))}
            </div>
          </div>

          <div className="ap-content">
            {activeSection === 'dashboard'  && <DashboardSection  employees={employees} orders={orders} services={services} products={products} stats={stats} />}
            {activeSection === 'employees'  && <EmployeesSection  employees={employees} setEmployees={setEmployees} notify={notify} currentUser={currentUser} />}
            {activeSection === 'orders'     && <OrdersSection     orders={orders}    setOrders={setOrders}    employees={employees} notify={notify} />}
            {activeSection === 'service'    && <ServiceSection    services={services} setServices={setServices} employees={employees} notify={notify} />}
            {activeSection === 'products'   && <ProductsSection   products={products} setProducts={setProducts} notify={notify} currentUser={currentUser} categories={categories} />}
            {activeSection === 'promotions' && <PromotionsSection promotions={promotions} setPromotions={setPromotions} products={products} notify={notify} currentUser={currentUser} />}
          </div>
        </div>
      )}
    </div>
  );
}
