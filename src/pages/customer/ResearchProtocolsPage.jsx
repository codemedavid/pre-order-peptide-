import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Link } from 'react-router-dom';
import {
    FlaskConical, ChevronDown, ChevronUp, Beaker, Clock, Thermometer,
    AlertTriangle, Syringe, Activity, BookOpen, ArrowRight, Shield, Droplets
} from 'lucide-react';

/* ─── Peptide research protocol data ─── */
const protocolData = {
    Semaglutide: {
        fullName: 'Semaglutide',
        molecularWeight: '4113.58 g/mol',
        sequence: 'Modified GLP-1 (7-37) analogue',
        mechanism: 'Selective GLP-1 receptor agonist that mimics the incretin hormone GLP-1, enhancing glucose-dependent insulin secretion and suppressing glucagon release. Features an albumin-binding fatty acid side chain for extended half-life (~7 days).',
        researchAreas: ['Glycemic control', 'Appetite regulation', 'Cardiovascular outcomes', 'Neuroprotection research'],
        reconstitution: {
            solvent: 'Bacteriostatic Water (BAC)',
            volumes: [
                { vialSize: '2mg', bacWater: '1 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' },
                { vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' },
                { vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' },
            ],
            instructions: 'Direct BAC water against vial wall gently. Do not shake — swirl slowly until fully dissolved. Allow to rest if foaming occurs.',
        },
        dosing: [
            { phase: 'Initial', range: '0.25 mg', frequency: 'Once weekly', duration: '4 weeks' },
            { phase: 'Titration', range: '0.5 mg', frequency: 'Once weekly', duration: '4 weeks' },
            { phase: 'Moderate', range: '1.0 mg', frequency: 'Once weekly', duration: '4 weeks' },
            { phase: 'Advanced', range: '1.7 – 2.4 mg', frequency: 'Once weekly', duration: 'Ongoing' },
        ],
        protocol: {
            loading: 'Weeks 1–4: Start at 0.25 mg/week to assess tolerance. Subcutaneous administration in abdomen, thigh, or upper arm.',
            titration: 'Weeks 5–16: Escalate by 0.25–0.5 mg every 4 weeks based on response and tolerability.',
            maintenance: 'Week 17+: Maintain at effective dose (typically 1.0–2.4 mg/week). Dose on same day each week.',
        },
        storage: {
            temperature: '2–8°C (refrigerated) before reconstitution',
            reconstituted: 'Refrigerate at 2–8°C. Use within 28 days after reconstitution.',
            lightSensitive: true,
            notes: 'Do not freeze. Protect from direct light. Discard if discolored or contains particles.',
        },
    },
    Tirzepatide: {
        fullName: 'Tirzepatide',
        molecularWeight: '4813.45 g/mol',
        sequence: 'Dual GIP/GLP-1 receptor agonist',
        mechanism: 'A novel dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist. Activates both incretin receptors simultaneously, producing synergistic effects on glucose metabolism, appetite regulation, and energy expenditure. Features C20 fatty diacid moiety for albumin binding.',
        researchAreas: ['Dual incretin signaling', 'Weight management', 'Insulin sensitivity', 'Metabolic syndrome'],
        reconstitution: {
            solvent: 'Bacteriostatic Water (BAC)',
            volumes: [
                { vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' },
                { vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' },
                { vialSize: '15mg', bacWater: '5 mL', concentration: '3 mg/mL (300 mcg per 0.1 mL)' },
            ],
            instructions: 'Add BAC water slowly along the vial wall. Swirl gently — do not shake. Solution should be clear and colorless.',
        },
        dosing: [
            { phase: 'Initial', range: '2.5 mg', frequency: 'Once weekly', duration: '4 weeks' },
            { phase: 'Titration', range: '5.0 mg', frequency: 'Once weekly', duration: '4 weeks' },
            { phase: 'Moderate', range: '7.5 – 10 mg', frequency: 'Once weekly', duration: '4 weeks' },
            { phase: 'Advanced', range: '12.5 – 15 mg', frequency: 'Once weekly', duration: 'Ongoing' },
        ],
        protocol: {
            loading: 'Weeks 1–4: Begin at 2.5 mg/week. Subcutaneous injection rotating sites.',
            titration: 'Weeks 5–20: Increase by 2.5 mg every 4 weeks. Monitor for GI tolerability.',
            maintenance: 'Week 21+: Maintain at 5–15 mg/week based on individual response.',
        },
        storage: {
            temperature: '2–8°C (refrigerated) before reconstitution',
            reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.',
            lightSensitive: true,
            notes: 'Do not freeze. Keep in original packaging until use. Discard unused portion after 28 days.',
        },
    },
    'BPC-157': {
        fullName: 'Body Protection Compound-157',
        molecularWeight: '1419.53 g/mol',
        sequence: 'Gly–Glu–Pro–Pro–Pro–Gly–Lys–Pro–Ala–Asp–Asp–Ala–Gly–Leu–Val',
        mechanism: 'A 15-amino acid pentadecapeptide derived from human gastric juice. Promotes angiogenesis via VEGF pathway upregulation, modulates nitric oxide synthesis, and interacts with the dopaminergic and serotonergic systems. Demonstrates cytoprotective effects across multiple organ systems.',
        researchAreas: ['Tissue repair & healing', 'Tendon & ligament recovery', 'Gut mucosal protection', 'Neuroprotection'],
        reconstitution: {
            solvent: 'Bacteriostatic Water (BAC)',
            volumes: [
                { vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' },
                { vialSize: '5mg', bacWater: '2 mL', concentration: '2.5 mg/mL (250 mcg per 0.1 mL)' },
            ],
            instructions: 'Direct BAC water stream gently down vial wall. Let dissolve — do not agitate vigorously.',
        },
        dosing: [
            { phase: 'Low', range: '200 – 300 mcg', frequency: '1–2× daily', duration: 'Ongoing' },
            { phase: 'Moderate', range: '300 – 500 mcg', frequency: '1–2× daily', duration: '4–6 weeks' },
            { phase: 'Intensive', range: '500 – 750 mcg', frequency: '2× daily', duration: '2–4 weeks' },
        ],
        protocol: {
            loading: 'Week 1: 250 mcg twice daily. Subcutaneous injection near the area of interest, or systemically.',
            titration: 'Weeks 2–3: Increase to 500 mcg twice daily if well-tolerated.',
            maintenance: 'Weeks 4–8: Maintain at effective dose. Common cycle is 4–6 weeks on, 2 weeks off.',
        },
        storage: {
            temperature: '2–8°C (refrigerated) before reconstitution',
            reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.',
            lightSensitive: true,
            notes: 'Highly stable peptide. Avoid repeated freeze-thaw cycles. Clear solution upon reconstitution.',
        },
    },
    'TB-500': {
        fullName: 'Thymosin Beta-4 (TB-500)',
        molecularWeight: '4921.0 g/mol',
        sequence: '43-amino acid naturally occurring peptide',
        mechanism: 'The primary active region of Thymosin Beta-4. Promotes cell migration, angiogenesis, and survival through interaction with actin. Upregulates cell-building proteins like actin, allowing for enhanced cellular migration to injury sites. Also reduces inflammation via downregulation of inflammatory cytokines.',
        researchAreas: ['Wound healing', 'Cardiac tissue repair', 'Hair growth', 'Anti-inflammatory pathways'],
        reconstitution: {
            solvent: 'Bacteriostatic Water (BAC)',
            volumes: [
                { vialSize: '2mg', bacWater: '1 mL', concentration: '2 mg/mL' },
                { vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' },
            ],
            instructions: 'Inject BAC water along vial wall. Allow to dissolve naturally over 1–2 minutes. Do not shake.',
        },
        dosing: [
            { phase: 'Loading', range: '4 – 8 mg', frequency: 'Twice weekly', duration: '4–6 weeks' },
            { phase: 'Moderate', range: '2 – 4 mg', frequency: 'Twice weekly', duration: '4 weeks' },
            { phase: 'Maintenance', range: '2 mg', frequency: 'Once weekly', duration: 'Ongoing' },
        ],
        protocol: {
            loading: 'Weeks 1–4: 4–8 mg split into 2 doses/week (e.g., Mon & Thu). Subcutaneous or intramuscular.',
            titration: 'Weeks 5–8: Reduce to 2–4 mg twice weekly based on research objectives.',
            maintenance: 'Week 9+: 2 mg once weekly. Commonly stacked with BPC-157 in research settings.',
        },
        storage: {
            temperature: '2–8°C (refrigerated) before reconstitution',
            reconstituted: 'Refrigerate at 2–8°C. Use within 14–21 days.',
            lightSensitive: false,
            notes: 'Store lyophilized form at -20°C for long-term storage. Avoid repeated freeze-thaw.',
        },
    },
    'NAD+': {
        fullName: 'Nicotinamide Adenine Dinucleotide (NAD+)',
        molecularWeight: '663.43 g/mol',
        sequence: 'Dinucleotide coenzyme',
        mechanism: 'Essential coenzyme found in all living cells. Central to cellular energy metabolism (mitochondrial oxidative phosphorylation), DNA repair (PARP activation), gene expression regulation (sirtuin activation), and calcium signaling. NAD+ levels decline with age, making supplementation a key area of longevity research.',
        researchAreas: ['Cellular energy metabolism', 'Anti-aging & longevity', 'DNA repair mechanisms', 'Neuroprotection'],
        reconstitution: {
            solvent: 'Bacteriostatic Water (BAC) or Sterile Water',
            volumes: [
                { vialSize: '100mg', bacWater: '2 mL', concentration: '50 mg/mL' },
                { vialSize: '250mg', bacWater: '5 mL', concentration: '50 mg/mL' },
                { vialSize: '500mg', bacWater: '10 mL', concentration: '50 mg/mL' },
            ],
            instructions: 'Add solvent slowly. NAD+ dissolves readily. Solution may have a slight yellow tint — this is normal.',
        },
        dosing: [
            { phase: 'Low', range: '50 – 100 mg', frequency: 'Daily or every other day', duration: 'Ongoing' },
            { phase: 'Moderate', range: '100 – 250 mg', frequency: 'Daily', duration: '2–4 weeks' },
            { phase: 'High', range: '250 – 500 mg', frequency: 'Daily', duration: 'Per protocol' },
        ],
        protocol: {
            loading: 'Week 1–2: Begin with 50–100 mg/day. Subcutaneous injection. Note: NAD+ injections may cause a flushing or stinging sensation.',
            titration: 'Weeks 3–4: Increase to 100–250 mg/day. Administer slowly if using IV route.',
            maintenance: 'Week 5+: Maintain at optimized dose. Many protocols cycle 4 weeks on, 1 week off.',
        },
        storage: {
            temperature: '-20°C for lyophilized (long-term) or 2–8°C (short-term)',
            reconstituted: 'Refrigerate at 2–8°C. Use within 14 days.',
            lightSensitive: true,
            notes: 'NAD+ is sensitive to light and heat. Store in amber vials if available. Slight yellow color in solution is normal.',
        },
    },
    'GHK-Cu': {
        fullName: 'Copper Peptide GHK-Cu (Glycyl-L-Histidyl-L-Lysine:Copper)',
        molecularWeight: '403.93 g/mol',
        sequence: 'Gly–His–Lys + Cu²⁺',
        mechanism: 'A naturally occurring tripeptide with high affinity for copper(II) ions. Stimulates collagen synthesis, promotes dermal fibroblast proliferation, and exhibits anti-inflammatory effects. Modulates gene expression involved in tissue remodeling — upregulates repair genes and downregulates tissue-destructive genes.',
        researchAreas: ['Skin regeneration', 'Collagen synthesis', 'Hair follicle stimulation', 'Anti-inflammatory research'],
        reconstitution: {
            solvent: 'Bacteriostatic Water (BAC)',
            volumes: [
                { vialSize: '50mg', bacWater: '2.5 mL', concentration: '20 mg/mL' },
                { vialSize: '200mg', bacWater: '10 mL', concentration: '20 mg/mL' },
            ],
            instructions: 'Add BAC water gently. GHK-Cu dissolves easily. Solution will have a characteristic blue tint from the copper complex.',
        },
        dosing: [
            { phase: 'Low', range: '200 – 500 mcg', frequency: 'Daily', duration: 'Ongoing' },
            { phase: 'Moderate', range: '500 mcg – 1 mg', frequency: 'Daily', duration: '4–8 weeks' },
            { phase: 'High', range: '1 – 2 mg', frequency: 'Daily', duration: '4 weeks max' },
        ],
        protocol: {
            loading: 'Weeks 1–2: 200–500 mcg daily. Subcutaneous in desired research area (commonly facial, scalp, or systemic).',
            titration: 'Weeks 3–4: Increase to 500 mcg–1 mg daily if tolerated.',
            maintenance: 'Weeks 5–12: Maintain dose. Typical cycle: 8–12 weeks on, 4 weeks off.',
        },
        storage: {
            temperature: '2–8°C (refrigerated) before reconstitution',
            reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.',
            lightSensitive: true,
            notes: 'Blue solution color is normal (copper complex). Avoid glass syringes — use plastic. Store away from light.',
        },
    },
};

/* ─── Accordion Card ─── */
const ProtocolCard = ({ product, data, isOpen, toggle }) => {
    if (!data) return null;

    return (
        <div className={`research-card ${isOpen ? 'research-card--open' : ''}`}>
            {/* Card header */}
            <button className="research-card-header" onClick={toggle} id={`protocol-${product.name.replace(/[^a-zA-Z0-9]/g, '')}`}>
                <div className="research-card-header-left">
                    <div className="research-card-icon">
                        <FlaskConical size={22} />
                    </div>
                    <div>
                        <h3>{data.fullName}</h3>
                        <div className="research-card-meta">
                            <span className="badge badge-primary">{product.category}</span>
                            <span className="research-card-mw">MW: {data.molecularWeight}</span>
                        </div>
                    </div>
                </div>
                <div className={`research-card-chevron ${isOpen ? 'research-card-chevron--open' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            {/* Expandable body */}
            <div className={`research-card-body ${isOpen ? 'research-card-body--open' : ''}`}>
                <div className="research-card-content">

                    {/* Overview */}
                    <div className="research-section">
                        <div className="research-section-title">
                            <BookOpen size={16} />
                            <h4>Overview</h4>
                        </div>
                        <p className="research-mechanism">{data.mechanism}</p>
                        <div className="research-sequence">
                            <strong>Sequence:</strong> {data.sequence}
                        </div>
                        <div className="research-areas">
                            <strong>Key Research Areas:</strong>
                            <div className="research-area-tags">
                                {data.researchAreas.map((area, i) => (
                                    <span key={i} className="research-area-tag">{area}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reconstitution */}
                    <div className="research-section">
                        <div className="research-section-title">
                            <Droplets size={16} />
                            <h4>Reconstitution Guide</h4>
                        </div>
                        <p className="research-solvent"><strong>Solvent:</strong> {data.reconstitution.solvent}</p>
                        <div className="table-wrapper" style={{ marginTop: '12px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Vial Size</th>
                                        <th>BAC Water</th>
                                        <th>Concentration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.reconstitution.volumes.map((v, i) => (
                                        <tr key={i}>
                                            <td><strong>{v.vialSize}</strong></td>
                                            <td>{v.bacWater}</td>
                                            <td>{v.concentration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="research-instruction">{data.reconstitution.instructions}</p>
                    </div>

                    {/* Dosing Ranges */}
                    <div className="research-section">
                        <div className="research-section-title">
                            <Syringe size={16} />
                            <h4>Research Dosing Ranges</h4>
                        </div>
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Phase</th>
                                        <th>Dose Range</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.dosing.map((d, i) => (
                                        <tr key={i}>
                                            <td>
                                                <span className={`research-phase-badge research-phase-badge--${d.phase.toLowerCase()}`}>
                                                    {d.phase}
                                                </span>
                                            </td>
                                            <td><strong>{d.range}</strong></td>
                                            <td>{d.frequency}</td>
                                            <td>{d.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Protocol Timeline */}
                    <div className="research-section">
                        <div className="research-section-title">
                            <Clock size={16} />
                            <h4>Protocol Timeline</h4>
                        </div>
                        <div className="research-timeline">
                            <div className="research-timeline-item">
                                <div className="research-timeline-dot research-timeline-dot--loading"></div>
                                <div>
                                    <strong>Loading Phase</strong>
                                    <p>{data.protocol.loading}</p>
                                </div>
                            </div>
                            <div className="research-timeline-item">
                                <div className="research-timeline-dot research-timeline-dot--titration"></div>
                                <div>
                                    <strong>Titration Phase</strong>
                                    <p>{data.protocol.titration}</p>
                                </div>
                            </div>
                            <div className="research-timeline-item">
                                <div className="research-timeline-dot research-timeline-dot--maintenance"></div>
                                <div>
                                    <strong>Maintenance Phase</strong>
                                    <p>{data.protocol.maintenance}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Storage & Handling */}
                    <div className="research-section">
                        <div className="research-section-title">
                            <Thermometer size={16} />
                            <h4>Storage & Handling</h4>
                        </div>
                        <div className="research-storage-grid">
                            <div className="research-storage-item">
                                <span className="research-storage-label">Pre-Reconstitution</span>
                                <span>{data.storage.temperature}</span>
                            </div>
                            <div className="research-storage-item">
                                <span className="research-storage-label">Post-Reconstitution</span>
                                <span>{data.storage.reconstituted}</span>
                            </div>
                            <div className="research-storage-item">
                                <span className="research-storage-label">Light Sensitive</span>
                                <span>{data.storage.lightSensitive ? '⚠️ Yes — protect from light' : '✅ No'}</span>
                            </div>
                        </div>
                        <p className="research-storage-notes">{data.storage.notes}</p>
                    </div>

                    {/* CTA to Product */}
                    <div className="research-card-cta">
                        <Link to="/products" className="btn btn-primary btn-sm">
                            View in Shop <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ─── */
const ResearchProtocolsPage = () => {
    const { products, getCategories } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openCards, setOpenCards] = useState({});

    const categories = getCategories();

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (!p.available) return false;
            if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
            if (!protocolData[p.name]) return false;
            return true;
        });
    }, [products, selectedCategory]);

    const toggleCard = (id) => {
        setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const expandAll = () => {
        const all = {};
        filteredProducts.forEach(p => { all[p.id] = true; });
        setOpenCards(all);
    };

    const collapseAll = () => setOpenCards({});

    return (
        <div>
            {/* Hero */}
            <section className="research-hero">
                <div className="container">
                    <div className="research-hero-badge">
                        <Shield size={14} />
                        For Research Purposes Only
                    </div>
                    <h1>
                        Research Dosing &<br />
                        <span>Protocols</span>
                    </h1>
                    <p>
                        Comprehensive reconstitution guides, dosing ranges, and protocol timelines for all available peptides.
                        Information provided for educational and research reference only.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '48px 0 80px' }}>
                <div className="container">

                    {/* Filter bar */}
                    <div className="research-controls">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                All Peptides
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-ghost btn-sm" onClick={expandAll}>Expand All</button>
                            <button className="btn btn-ghost btn-sm" onClick={collapseAll}>Collapse All</button>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="research-disclaimer">
                        <AlertTriangle size={18} />
                        <div>
                            <strong>Research Use Only</strong>
                            <p>
                                All dosing and protocol information is provided strictly for educational and research reference purposes.
                                These are not medical recommendations. Always consult a licensed professional for clinical applications.
                            </p>
                        </div>
                    </div>

                    {/* Quick reference tip */}
                    <div className="research-tip">
                        <Beaker size={16} />
                        <span>
                            <strong>Tip:</strong> Click on a peptide card below to expand its full protocol details including reconstitution, dosing, and storage information.
                        </span>
                    </div>

                    {/* Protocol Cards */}
                    <div className="research-cards">
                        {filteredProducts.map(product => (
                            <ProtocolCard
                                key={product.id}
                                product={product}
                                data={protocolData[product.name]}
                                isOpen={!!openCards[product.id]}
                                toggle={() => toggleCard(product.id)}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <FlaskConical size={28} />
                            </div>
                            <h3>No protocols found</h3>
                            <p>Try selecting a different category above.</p>
                        </div>
                    )}

                    {/* General reconstitution note */}
                    <div className="research-general-note">
                        <h3>General Reconstitution Best Practices</h3>
                        <div className="research-best-practices">
                            {[
                                { icon: <Syringe size={18} />, title: 'Use Insulin Syringes', desc: 'Use 29–31 gauge insulin syringes for accurate dosing and comfortable subcutaneous injection.' },
                                { icon: <Droplets size={18} />, title: 'BAC Water for Multi-Use', desc: 'Bacteriostatic water (0.9% benzyl alcohol) allows multiple draws from the same vial over days.' },
                                { icon: <Thermometer size={18} />, title: 'Always Refrigerate', desc: 'Store reconstituted peptides at 2–8°C. Never freeze reconstituted solutions.' },
                                { icon: <Activity size={18} />, title: 'Rotate Injection Sites', desc: 'Rotate between abdomen, thighs, and upper arms to minimize irritation.' },
                            ].map((item, i) => (
                                <div key={i} className="research-practice-card">
                                    <div className="research-practice-icon">{item.icon}</div>
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResearchProtocolsPage;
