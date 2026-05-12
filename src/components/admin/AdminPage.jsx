import React, { useState, useCallback } from "react";
import ST from "../../styles/styles";
import "./AdminPage.css";
import HomePage from "../../pages/HomePage";
import { useNavigate } from 'react-router-dom';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_EMPLOYEES = [
    { id: 1, name: "Andrei Popescu",  email: "andrei@pcg.ro", role: "senior", phone: "0722 111 222", createdAt: "2024-01-10" },
    { id: 2, name: "Maria Ionescu",   email: "maria@pcg.ro",  role: "junior", phone: "0733 222 333", createdAt: "2024-03-15" },
    { id: 3, name: "Vlad Dumitrescu", email: "vlad@pcg.ro",   role: "senior", phone: "0744 333 444", createdAt: "2023-11-05" },
    { id: 4, name: "Elena Constantin",email: "elena@pcg.ro",  role: "junior", phone: "0755 444 555", createdAt: "2024-05-20" },
];

const MOCK_ORDERS = [
    { id: "ORD-001", client: "Ion Popa",       product: "RTX 4070 Ti",         amount: 3200, status: "pending",    assignedTo: null, createdAt: "2025-05-10" },
    { id: "ORD-002", client: "Gheorghe Marin", product: "Intel i9-14900K",     amount: 2100, status: "processing", assignedTo: 1,    createdAt: "2025-05-09" },
    { id: "ORD-003", client: "Ana Radu",       product: "Corsair RM1000x",     amount: 780,  status: "completed",  assignedTo: 2,    createdAt: "2025-05-08" },
    { id: "ORD-004", client: "Mihai Stan",     product: "Samsung 990 Pro 2TB", amount: 560,  status: "cancelled",  assignedTo: 3,    createdAt: "2025-05-07" },
];

const MOCK_SERVICES = [
    { id: "SRV-001", client: "Bogdan Luca",  description: "Curatare si repastare PC",       status: "pending",    assignedTo: null, createdAt: "2025-05-11" },
    { id: "SRV-002", client: "Daniela Popa", description: "Diagnosticare sistem",           status: "processing", assignedTo: 2,    createdAt: "2025-05-10" },
    { id: "SRV-003", client: "Radu Nica",    description: "Inlocuire pasta termala laptop", status: "completed",  assignedTo: 1,    createdAt: "2025-05-09" },
];

const MOCK_PRODUCTS = [
    { id: 1, name: "RTX 4070 Ti Super",    category: "GPU", price: 3400, stock: 5,  addedBy: 1 },
    { id: 2, name: "Intel Core i9-14900K", category: "CPU", price: 2100, stock: 8,  addedBy: 3 },
    { id: 3, name: "Corsair DDR5 32GB",    category: "RAM", price: 420,  stock: 15, addedBy: 1 },
];

const ORDER_STATUSES   = ["pending", "processing", "completed", "cancelled"];
const SERVICE_STATUSES = ["pending", "processing", "completed", "cancelled"];

// ─── Small helpers ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    return <span className={`ap-badge ap-badge--${status}`}>{status}</span>;
}

function RoleBadge({ role }) {
    return <span className={`ap-badge ap-badge--${role}`}>{role}</span>;
}

function Notification({ notification }) {
    if (!notification) return null;
    const cls = notification.type === "success" ? "ap-toast ap-toast--success" : "ap-toast ap-toast--error";
    return (
        <div className={cls}>
            {notification.type === "success" ? "✓" : "✕"} {notification.msg}
        </div>
    );
}

// ─── Add Employee Modal ───────────────────────────────────────────────────────
function AddEmployeeModal({ onClose, onAdd }) {
    const [form, setForm]   = useState({ name: "", email: "", phone: "", role: "junior", password: "" });
    const [error, setError] = useState("");
    const set = (k, v)      => setForm(f => ({ ...f, [k]: v }));

    const submit = () => {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError("Completati toate campurile obligatorii."); return;
        }
        onAdd({ ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] });
        onClose();
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
                <input style={ST.input} value={form.name}     onChange={e => set("name", e.target.value)}     placeholder="ex: Ion Popescu" />
                <label style={ST.label}>Email *</label>
                <input style={ST.input} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ion@pcg.ro" />
                <label style={ST.label}>Telefon</label>
                <input style={ST.input} value={form.phone}    onChange={e => set("phone", e.target.value)}    placeholder="07xx xxx xxx" />
                <label style={ST.label}>Parola *</label>
                <input style={ST.input} type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
                <label style={ST.label}>Rol</label>
                <select style={ST.select} value={form.role} onChange={e => set("role", e.target.value)}>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                </select>

                <div className="ap-role-hint">
                    {form.role === "senior"
                        ? "⭐ Seniori pot adăuga produse/piese noi și pot onora comenzi/service-uri."
                        : "🔰 Juniorii pot onora comenzi și service-uri, dar nu pot adăuga produse."}
                </div>

                <div className="ap-modal-actions">
                    <button style={ST.btnSec} onClick={onClose}>Anulare</button>
                    <button style={ST.btn}    onClick={submit}>Adauga angajat</button>
                </div>
            </div>
        </div>
    );
}

// ─── Change Status Modal ──────────────────────────────────────────────────────
function ChangeStatusModal({ item, type, employees, onClose, onSave }) {
    const statuses = type === "order" ? ORDER_STATUSES : SERVICE_STATUSES;
    const [status,     setStatus]     = useState(item.status);
    const [assignedTo, setAssignedTo] = useState(item.assignedTo || "");

    return (
        <div style={ST.modal}>
            <div style={{ ...ST.mContent, maxWidth: 440 }}>
                <div className="ap-modal-header">
                    <h3 className="ap-modal-title--sm">
                        {type === "order" ? "📦 Actualizare Comanda" : "🔧 Actualizare Service"}
                    </h3>
                    <button style={ST.btnSec} onClick={onClose}>✕</button>
                </div>

                <div className="ap-modal-item-preview">
                    <div className="ap-modal-item-label">{type === "order" ? "Comanda" : "Tichet"}</div>
                    <div className="ap-modal-item-id">{item.id}</div>
                    <div className="ap-modal-item-desc">{type === "order" ? item.product : item.description}</div>
                </div>

                <label style={ST.label}>Status</label>
                <select style={ST.select} value={status} onChange={e => setStatus(e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>

                <label style={ST.label}>Atribuie angajat</label>
                <select style={ST.select} value={assignedTo} onChange={e => setAssignedTo(e.target.value ? Number(e.target.value) : "")}>
                    <option value="">— Neatribuit —</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                </select>

                <div className="ap-modal-actions">
                    <button style={ST.btnSec} onClick={onClose}>Anulare</button>
                    <button style={ST.btn} onClick={() => { onSave({ ...item, status, assignedTo }); onClose(); }}>Salveaza</button>
                </div>
            </div>
        </div>
    );
}

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({ onClose, onAdd, employeeId }) {
    const [form, setForm]   = useState({ name: "", category: "", price: "", stock: "" });
    const [error, setError] = useState("");
    const set = (k, v)      => setForm(f => ({ ...f, [k]: v }));

    const submit = () => {
        if (!form.name.trim() || !form.category.trim() || !form.price || !form.stock) {
            setError("Completati toate campurile."); return;
        }
        onAdd({ ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock), addedBy: employeeId });
        onClose();
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
                <input style={ST.input} value={form.name}     onChange={e => set("name", e.target.value)}     placeholder="ex: RTX 4090" />
                <label style={ST.label}>Categorie *</label>
                <input style={ST.input} value={form.category} onChange={e => set("category", e.target.value)} placeholder="ex: GPU, CPU, RAM…" />
                <label style={ST.label}>Pret (Lei) *</label>
                <input style={ST.input} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" />
                <label style={ST.label}>Stoc *</label>
                <input style={ST.input} type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" />
                <div className="ap-modal-actions">
                    <button style={ST.btnSec} onClick={onClose}>Anulare</button>
                    <button style={ST.btn}    onClick={submit}>Adauga produs</button>
                </div>
            </div>
        </div>
    );
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────
function DashboardSection({ employees, orders, services, products }) {
    const stats = [
        { label: "Angajati",           value: employees.length,                                                                icon: "👥", color: "#9b59b6" },
        { label: "Comenzi active",     value: orders.filter(o => o.status === "processing" || o.status === "pending").length,  icon: "📦", color: "#FF6B35" },
        { label: "Service-uri active", value: services.filter(s => s.status === "processing" || s.status === "pending").length,icon: "🔧", color: "#3498db" },
        { label: "Produse in stoc",    value: products.reduce((a, p) => a + p.stock, 0),                                       icon: "🖥️", color: "#2ecc71" },
    ];

    const pendingOrders   = orders.filter(o => o.status === "pending");
    const pendingServices = services.filter(s => s.status === "pending");

    return (
        <>
            <h3 className="ap-section-title" style={{ marginBottom: 20 }}>📊 Panou General</h3>

            <div className="ap-stats-grid">
                {stats.map(s => (
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
                                    <div className="ap-pending-row-name">{o.product}</div>
                                    <div className="ap-pending-row-sub">{o.client} · {o.id}</div>
                                </div>
                                <div className="ap-pending-row-amount">{o.amount.toLocaleString()} Lei</div>
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
                                    <div className="ap-pending-row-name">{s.description}</div>
                                    <div className="ap-pending-row-sub">{s.client} · {s.id}</div>
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

// ─── Section: Employees ───────────────────────────────────────────────────────
function EmployeesSection({ employees, setEmployees, notify, currentRole }) {
    const [showAdd, setShowAdd] = useState(false);
    const [search,  setSearch]  = useState("");

    if (currentRole !== "manager") return (
        <div className="ap-locked">
            <div className="ap-locked-icon">🔒</div>
            <p>Doar managerul poate gestiona angajatii.</p>
        </div>
    );

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {showAdd && (
                <AddEmployeeModal
                    onClose={() => setShowAdd(false)}
                    onAdd={emp => { setEmployees(p => [...p, emp]); notify("Angajat adaugat!"); }}
                />
            )}

            <div className="ap-section-header">
                <h3 className="ap-section-title">👥 Angajati ({employees.length})</h3>
                <div className="ap-section-controls">
                    <input
                        className="ap-search-input"
                        placeholder="🔍 Cauta…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button style={ST.btn} onClick={() => setShowAdd(true)}>+ Angajat nou</button>
                </div>
            </div>

            <div className="ap-table-wrap">
                <table style={ST.table}>
                    <thead>
                    <tr>{["Angajat","Email","Telefon","Rol","Adaugat","Actiuni"].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                    {filtered.map(emp => (
                        <tr key={emp.id}>
                            <td style={ST.td}>
                                <div className="ap-emp-cell">
                                    <div className={`ap-emp-avatar ap-emp-avatar--${emp.role}`}>{emp.name.charAt(0)}</div>
                                    <span className="ap-fw-600">{emp.name}</span>
                                </div>
                            </td>
                            <td style={ST.td} className="ap-text-muted">{emp.email}</td>
                            <td style={ST.td} className="ap-text-muted">{emp.phone || "—"}</td>
                            <td style={ST.td}><RoleBadge role={emp.role} /></td>
                            <td style={ST.td} className="ap-text-dim">{emp.createdAt}</td>
                            <td style={ST.td}>
                                <button
                                    style={ST.btnDanger}
                                    onClick={() => { setEmployees(p => p.filter(e => e.id !== emp.id)); notify("Angajat eliminat."); }}
                                >
                                    Elimina
                                </button>
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

// ─── Section: Orders ──────────────────────────────────────────────────────────
function OrdersSection({ orders, setOrders, employees, notify }) {
    const [modal,        setModal]        = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");

    const filtered     = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);
    const assigneeName = id => { const e = employees.find(e => e.id === id); return e ? e.name : "—"; };

    return (
        <>
            {modal && (
                <ChangeStatusModal
                    item={modal} type="order" employees={employees}
                    onClose={() => setModal(null)}
                    onSave={upd => { setOrders(p => p.map(o => o.id === upd.id ? upd : o)); notify("Comanda actualizata!"); }}
                />
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
                    <thead>
                    <tr>{["ID Comanda","Client","Produs","Suma","Status","Atribuit","Data","Actiuni"].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                    {filtered.map(order => (
                        <tr key={order.id}>
                            <td style={ST.td} className="ap-text-orange ap-fw-700">{order.id}</td>
                            <td style={ST.td}>{order.client}</td>
                            <td style={ST.td} className="ap-text-muted">{order.product}</td>
                            <td style={ST.td} className="ap-fw-700">{order.amount.toLocaleString()} Lei</td>
                            <td style={ST.td}><StatusBadge status={order.status} /></td>
                            <td style={ST.td} className="ap-text-dim">{assigneeName(order.assignedTo)}</td>
                            <td style={ST.td} className="ap-text-dim">{order.createdAt}</td>
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

// ─── Section: Service ─────────────────────────────────────────────────────────
function ServiceSection({ services, setServices, employees, notify }) {
    const [modal,        setModal]        = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");

    const filtered     = filterStatus === "all" ? services : services.filter(s => s.status === filterStatus);
    const assigneeName = id => { const e = employees.find(e => e.id === id); return e ? e.name : "—"; };

    return (
        <>
            {modal && (
                <ChangeStatusModal
                    item={modal} type="service" employees={employees}
                    onClose={() => setModal(null)}
                    onSave={upd => { setServices(p => p.map(s => s.id === upd.id ? upd : s)); notify("Service actualizat!"); }}
                />
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
                    <thead>
                    <tr>{["ID Tichet","Client","Descriere","Status","Atribuit","Data","Actiuni"].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                    {filtered.map(srv => (
                        <tr key={srv.id}>
                            <td style={ST.td} className="ap-text-blue ap-fw-700">{srv.id}</td>
                            <td style={ST.td}>{srv.client}</td>
                            <td style={ST.td} className="ap-text-muted" style={{ maxWidth: 240 }}>{srv.description}</td>
                            <td style={ST.td}><StatusBadge status={srv.status} /></td>
                            <td style={ST.td} className="ap-text-dim">{assigneeName(srv.assignedTo)}</td>
                            <td style={ST.td} className="ap-text-dim">{srv.createdAt}</td>
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

// ─── Section: Products ────────────────────────────────────────────────────────
function ProductsSection({ products, setProducts, employees, notify, currentRole, currentEmployeeId }) {
    const [showAdd, setShowAdd] = useState(false);
    const canAdd      = currentRole === "senior" || currentRole === "manager";
    const addedByName = id => { const e = employees.find(e => e.id === id); return e ? e.name : "—"; };

    return (
        <>
            {showAdd && (
                <AddProductModal
                    onClose={() => setShowAdd(false)} employeeId={currentEmployeeId}
                    onAdd={prod => { setProducts(p => [...p, prod]); notify("Produs adaugat!"); }}
                />
            )}

            <div className="ap-section-header">
                <h3 className="ap-section-title">🖥️ Produse & Piese ({products.length})</h3>
                {canAdd
                    ? <button style={ST.btn} onClick={() => setShowAdd(true)}>+ Produs nou</button>
                    : <div style={ST.warning}>Doar angajatii seniori pot adauga produse.</div>
                }
            </div>

            <div className="ap-table-wrap">
                <table style={ST.table}>
                    <thead>
                    <tr>{["Denumire","Categorie","Pret","Stoc","Adaugat de","Actiuni"].map(h => <th key={h} style={ST.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                    {products.map(prod => (
                        <tr key={prod.id}>
                            <td style={ST.td} className="ap-fw-600">{prod.name}</td>
                            <td style={ST.td}><span className="ap-category-chip">{prod.category}</span></td>
                            <td style={ST.td} className="ap-text-orange ap-fw-700">{prod.price.toLocaleString()} Lei</td>
                            <td style={ST.td} className={prod.stock < 3 ? "ap-stock--low" : "ap-stock--ok"}>{prod.stock}</td>
                            <td style={ST.td} className="ap-text-dim">{addedByName(prod.addedBy)}</td>
                            <td style={ST.td}>
                                {canAdd && (
                                    <button style={ST.btnDanger} onClick={() => { setProducts(p => p.filter(x => x.id !== prod.id)); notify("Produs eliminat."); }}>
                                        Elimina
                                    </button>
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

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPanel() {
    const navigate = useNavigate();

    // Change role to test views: "manager" | "senior" | "junior"
    const currentUser = { id: 99, name: "Manager PCG", role: "manager" };

    const [activeSection, setActiveSection] = useState("dashboard");
    const [notification,  setNotification]  = useState(null);
    const [employees,     setEmployees]      = useState(MOCK_EMPLOYEES);
    const [orders,        setOrders]         = useState(MOCK_ORDERS);
    const [services,      setServices]       = useState(MOCK_SERVICES);
    const [products,      setProducts]       = useState(MOCK_PRODUCTS);

    const notify = useCallback((msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const sidebarItems = [
        { id: "dashboard", label: "Panou General",  icon: "📊" },
        { id: "orders",    label: "Comenzi",         icon: "📦" },
        { id: "service",   label: "Service",          icon: "🔧" },
        { id: "products",  label: "Produse & Piese",  icon: "🖥️" },
        ...(currentUser.role === "manager" ? [{ id: "employees", label: "Angajati", icon: "👥" }] : []),
    ];

    const permissions = [
        { label: "Gestioneaza angajati", allowed: currentUser.role === "manager" },
        { label: "Adauga produse",       allowed: currentUser.role === "senior" || currentUser.role === "manager" },
        { label: "Onoreaza comenzi",     allowed: true },
        { label: "Onoreaza service",     allowed: true },
    ];

    return (
        <div style={ST.app}>
            <Notification notification={notification} />

            {/* ── Header ── */}
            <div style={ST.header}>
                <div style={ST.headerTop}>
                    <div style={ST.logo}>PCG Admin</div>

                    <div className="ap-header-right-side">
                        <div className="ap-header-user">
                            <div className="ap-header-user-info">
                                <div className="ap-header-user-name">{currentUser.name}</div>
                                <div className="ap-header-user-role"><RoleBadge role={currentUser.role} /></div>
                            </div>
                            <div className="ap-header-avatar">{currentUser.name.charAt(0)}</div>
                        </div>

                        <div className="ap-header-button-main-page">
                            <button
                                style={{ ...ST.btn, padding: "10px 10px", fontSize: 14 }}
                                onClick={() => navigate('/')}>
                                Back to Home Page
                            </button>
                        </div>
                    </div>


                </div>
            </div>

            {/* ── Body ── */}
            <div className="ap-body">
                {/* Sidebar */}
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

                    {/* Permissions box */}
                    <div className="ap-permissions-box">
                        <div className="ap-permissions-title">Permisiuni</div>
                        {permissions.map(p => (
                            <div key={p.label} className="ap-permission-row">
                <span className={p.allowed ? "ap-permission-row--allowed" : "ap-permission-row--denied"}>
                  {p.allowed ? "✓" : "✕"}
                </span>
                                {p.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ap-content">
                    {activeSection === "dashboard" && <DashboardSection  employees={employees} orders={orders} services={services} products={products} />}
                    {activeSection === "employees" && <EmployeesSection  employees={employees} setEmployees={setEmployees} notify={notify} currentRole={currentUser.role} />}
                    {activeSection === "orders"    && <OrdersSection     orders={orders}   setOrders={setOrders}       employees={employees} notify={notify} />}
                    {activeSection === "service"   && <ServiceSection    services={services} setServices={setServices} employees={employees} notify={notify} />}
                    {activeSection === "products"  && <ProductsSection   products={products} setProducts={setProducts} employees={employees} notify={notify} currentRole={currentUser.role} currentEmployeeId={currentUser.id} />}
                </div>
            </div>
        </div>
    );
}