import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ST from '../../styles/styles';

const S = {
    page: { ...ST.app, padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
    container: { width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 },
    backBtn: { background: 'transparent', border: 'none', color: '#FF6B35', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0, width: 'fit-content' },
    header: { display: 'flex', flexDirection: 'column', gap: 6 },
    headerTitle: { fontSize: 32, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#FF6B35,#e94560)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    headerSub: { margin: 0, fontSize: 15, color: '#888' },
    fieldset: { ...ST.mContent, display: 'flex', flexDirection: 'column', gap: 0, padding: 24 },
    legend: { fontSize: 13, fontWeight: 700, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    formGroup: { display: 'flex', flexDirection: 'column', marginBottom: 16 },
    formGroupLast: { display: 'flex', flexDirection: 'column', marginBottom: 0 },
    errorMsg: { color: '#e74c3c', fontSize: 12, fontWeight: 700, marginTop: 4 },
    inputError: { borderColor: '#e74c3c' },
    charCount: { fontSize: 12, color: '#555', textAlign: 'right', marginTop: 2 },
    submitBtn: { ...ST.btn, padding: '14px 0', width: '100%', fontSize: 17, borderRadius: 8 },
    // Succes
    successWrap: { ...ST.app, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    successCard: { ...ST.mContent, textAlign: 'center', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, margin: '60px auto' },
    successIcon: { width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B35,#e94560)', color: '#fff', fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
    successTitle: { fontSize: 26, margin: 0 },
    successText: { fontSize: 15, color: '#aaa', lineHeight: 1.6, margin: 0 },
    backToShopBtn: { ...ST.btn, padding: '12px 30px', fontSize: 15, marginTop: 8 },
};

function ServicePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkMode = location.state?.isDarkMode ?? true;

    const [formData, setFormData] = useState({ nume: '', email: '', telefon: '', descriere: '', data: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const validate = () => {
        const e = {};
        if (!formData.nume.trim()) e.nume = 'Numele este obligatoriu.';
        if (!formData.email.trim()) {
            e.email = 'Email-ul este obligatoriu.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            e.email = 'Email-ul nu este valid.';
        }
        if (!formData.telefon.trim()) {
            e.telefon = 'Telefonul este obligatoriu.';
        } else if (!/^[0-9]{10}$/.test(formData.telefon.replace(/\s/g, ''))) {
            e.telefon = 'Numarul de telefon trebuie sa aiba 10 cifre.';
        }
        if (!formData.descriere.trim()) {
            e.descriere = 'Descrierea problemei este obligatorie.';
        } else if (formData.descriere.trim().length < 10) {
            e.descriere = 'Descrierea trebuie sa aiba cel putin 10 caractere.';
        }
        if (!formData.data) e.data = 'Data programarii este obligatorie.';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        const cerere = { ...formData, id: Date.now(), status: 'In asteptare', creatLa: new Date().toISOString() };
        const existente = JSON.parse(localStorage.getItem('pcg_service_requests') || '[]');
        existente.push(cerere);
        localStorage.setItem('pcg_service_requests', JSON.stringify(existente));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={S.successWrap}>
                <div style={S.successCard}>
                    <div style={S.successIcon}>✓</div>
                    <h2 style={S.successTitle}>Cerere trimisa cu succes!</h2>
                    <p style={S.successText}>
                        Te vom contacta la adresa <strong style={{ color: '#FF6B35' }}>{formData.email}</strong> sau la numarul{' '}
                        <strong style={{ color: '#FF6B35' }}>{formData.telefon}</strong> pentru confirmarea programarii din{' '}
                        <strong style={{ color: '#FF6B35' }}>
                            {new Date(formData.data).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </strong>.
                    </p>
                    <button style={S.backToShopBtn} onClick={() => navigate('/', { state: { isDarkMode } })}>
                        Inapoi la magazin
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={S.page}>
            <div style={S.container}>
                <button style={S.backBtn} onClick={() => navigate(-1)}>← Inapoi</button>

                <div style={S.header}>
                    <h1 style={S.headerTitle}>Cerere Service</h1>
                    <p style={S.headerSub}>Completeaza formularul de mai jos si te vom contacta pentru a confirma programarea.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* DATE DE CONTACT */}
                    <div style={S.fieldset}>
                        <div style={S.legend}>Date de contact</div>

                        <div style={S.formGroup}>
                            <label style={ST.label}>Nume complet *</label>
                            <input
                                name="nume" type="text" placeholder="ex: Ion Popescu"
                                value={formData.nume} onChange={handleChange}
                                style={{ ...ST.input, ...(errors.nume ? S.inputError : {}) }}
                            />
                            {errors.nume && <span style={S.errorMsg}>{errors.nume}</span>}
                        </div>

                        <div style={S.formRow}>
                            <div style={S.formGroup}>
                                <label style={ST.label}>Adresa de email *</label>
                                <input
                                    name="email" type="email" placeholder="ex: ion@example.com"
                                    value={formData.email} onChange={handleChange}
                                    style={{ ...ST.input, ...(errors.email ? S.inputError : {}) }}
                                />
                                {errors.email && <span style={S.errorMsg}>{errors.email}</span>}
                            </div>
                            <div style={S.formGroup}>
                                <label style={ST.label}>Numar de telefon *</label>
                                <input
                                    name="telefon" type="tel" placeholder="ex: 0740123456"
                                    value={formData.telefon} onChange={handleChange}
                                    style={{ ...ST.input, ...(errors.telefon ? S.inputError : {}) }}
                                />
                                {errors.telefon && <span style={S.errorMsg}>{errors.telefon}</span>}
                            </div>
                        </div>
                    </div>

                    {/* DESCRIEREA PROBLEMEI */}
                    <div style={{ ...S.fieldset, marginTop: 16 }}>
                        <div style={S.legend}>Descrierea problemei</div>

                        <div style={S.formGroupLast}>
                            <label style={ST.label}>Descrie problema *</label>
                            <textarea
                                name="descriere" rows={5}
                                placeholder="Descrie in detaliu problema intampinata (ex: PC-ul nu porneste, placa video emite artefacte, etc.)"
                                value={formData.descriere} onChange={handleChange}
                                style={{ ...ST.textarea, ...(errors.descriere ? S.inputError : {}), marginBottom: 0 }}
                            />
                            <span style={S.charCount}>{formData.descriere.length} caractere</span>
                            {errors.descriere && <span style={S.errorMsg}>{errors.descriere}</span>}
                        </div>
                    </div>

                    {/* DATA PROGRAMARII */}
                    <div style={{ ...S.fieldset, marginTop: 16 }}>
                        <div style={S.legend}>Data programarii</div>

                        <div style={S.formGroupLast}>
                            <label style={ST.label}>Alege o data *</label>
                            <input
                                name="data" type="date" min={today}
                                value={formData.data} onChange={handleChange}
                                style={{ ...ST.input, marginBottom: 0, colorScheme: 'dark', ...(errors.data ? S.inputError : {}) }}
                            />
                            {errors.data && <span style={S.errorMsg}>{errors.data}</span>}
                        </div>
                    </div>

                    <button type="submit" style={{ ...S.submitBtn, marginTop: 24 }}>
                        Trimite cererea
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ServicePage;
