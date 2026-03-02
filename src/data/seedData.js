import { v4 as uuidv4 } from 'uuid';

const now = new Date();
const sessionEnd = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

export const seedProducts = [
    // ═══════════════════════════════════════════
    // 🔵 WEIGHT LOSS / METABOLIC RESEARCH
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'Semaglutide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg × 10 vials', price: 2280, available: true },
            { id: uuidv4(), size: '10mg × 10 vials', price: 3420, available: true },
            { id: uuidv4(), size: '15mg × 10 vials', price: 3990, available: true },
            { id: uuidv4(), size: '20mg × 10 vials', price: 4845, available: true },
            { id: uuidv4(), size: '30mg × 10 vials', price: 5700, available: true },
        ],
        description: 'High-purity Semaglutide for research purposes. GLP-1 receptor agonist used in weight loss and metabolic studies.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Tirzepatide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2280, available: true },
            { id: uuidv4(), size: '10mg', price: 3420, available: true },
            { id: uuidv4(), size: '15mg', price: 3990, available: true },
            { id: uuidv4(), size: '20mg', price: 5130, available: true },
            { id: uuidv4(), size: '30mg', price: 6840, available: true },
            { id: uuidv4(), size: '40mg', price: 7980, available: true },
            { id: uuidv4(), size: '50mg', price: 10260, available: true },
            { id: uuidv4(), size: '60mg', price: 11400, available: true },
        ],
        description: 'Dual GIP/GLP-1 receptor agonist peptide for metabolic and weight loss research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Retatrutide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 3135, available: true },
            { id: uuidv4(), size: '10mg', price: 5130, available: true },
            { id: uuidv4(), size: '15mg', price: 6840, available: true },
            { id: uuidv4(), size: '20mg', price: 9120, available: true },
        ],
        description: 'Triple agonist (GIP/GLP-1/Glucagon) peptide for advanced metabolic research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Cagrilintide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '2.5mg', price: 2850, available: true },
            { id: uuidv4(), size: '5mg', price: 4560, available: true },
        ],
        description: 'Long-acting amylin analogue for weight management and metabolic research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Cagrilintide + Semaglutide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '2.5mg + 2.5mg', price: 4845, available: true },
            { id: uuidv4(), size: '5mg + 5mg', price: 7980, available: true },
        ],
        description: 'Combination blend of Cagrilintide and Semaglutide for synergistic metabolic research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Survodutide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 5700, available: true },
            { id: uuidv4(), size: '10mg', price: 10260, available: true },
        ],
        description: 'Dual glucagon/GLP-1 receptor agonist for metabolic research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'AOD9604',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 3420, available: true },
            { id: uuidv4(), size: '10mg', price: 5700, available: true },
        ],
        description: 'Modified fragment of human growth hormone (HGH fragment 176-191) for fat metabolism research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Adipotide',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 5700, available: true },
        ],
        description: 'Peptidomimetic targeting adipose tissue vasculature for obesity research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'AICAR',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '50mg', price: 7410, available: true },
        ],
        description: 'AMPK activator peptide for metabolic and exercise mimetic research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: '5-Amino-1MQ',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2280, available: true },
            { id: uuidv4(), size: '50mg', price: 7410, available: true },
        ],
        description: 'NNMT inhibitor for metabolic research and fat cell regulation studies.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'SLU-PP-322',
        category: 'Weight Loss / Metabolic Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 3990, available: true },
        ],
        description: 'Exercise mimetic compound for metabolic and endurance research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 GROWTH HORMONE AXIS / BODY COMPOSITION
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'HGH',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '10iu', price: 3420, available: true },
            { id: uuidv4(), size: '20iu', price: 5700, available: true },
            { id: uuidv4(), size: '50iu', price: 9120, available: true },
        ],
        description: 'Human Growth Hormone for growth hormone axis and body composition research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'HGH Fragment 176-191',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '5mg', price: 7410, available: true },
        ],
        description: 'C-terminal fragment of HGH for targeted fat metabolism research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'CJC-1295 Without DAC',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '5mg', price: 5130, available: true },
            { id: uuidv4(), size: '10mg', price: 9120, available: true },
        ],
        description: 'Modified GRF (1-29) without Drug Affinity Complex for growth hormone research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'CJC-1295 With DAC',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '5mg', price: 9690, available: true },
        ],
        description: 'Modified GRF (1-29) with Drug Affinity Complex for sustained GH release research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'CJC-1295 + Ipamorelin',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '10mg', price: 6270, available: true },
        ],
        description: 'Synergistic blend of CJC-1295 and Ipamorelin for growth hormone pulse research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Ipamorelin',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2850, available: true },
            { id: uuidv4(), size: '10mg', price: 5130, available: true },
        ],
        description: 'Selective GH secretagogue peptide for growth hormone research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Hexarelin',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '2mg', price: 3420, available: true },
            { id: uuidv4(), size: '5mg', price: 5130, available: true },
            { id: uuidv4(), size: '10mg', price: 9690, available: true },
        ],
        description: 'Potent GH-releasing hexapeptide for growth hormone axis research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Tesamorelin',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '2mg', price: 6270, available: true },
            { id: uuidv4(), size: '5mg', price: 11400, available: true },
            { id: uuidv4(), size: '10mg', price: 19950, available: true },
        ],
        description: 'GHRH analogue for growth hormone release and visceral fat reduction research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Sermorelin Acetate',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '5mg', price: 4560, available: true },
            { id: uuidv4(), size: '10mg', price: 7410, available: true },
        ],
        description: 'GHRH (1-29) analogue for growth hormone stimulation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'IGF-1 LR3',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '0.1mg', price: 2565, available: true },
            { id: uuidv4(), size: '1mg', price: 11970, available: true },
        ],
        description: 'Long-acting IGF-1 analogue for insulin-like growth factor research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'IGF-DES',
        category: 'Growth Hormone / Body Composition',
        variants: [
            { id: uuidv4(), size: '1mg', price: 3420, available: true },
        ],
        description: 'Truncated IGF-1 variant for targeted growth factor research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 HEALING / TISSUE REPAIR
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'BPC-157',
        category: 'Healing / Tissue Repair',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2850, available: true },
            { id: uuidv4(), size: '10mg', price: 4560, available: true },
        ],
        description: 'Body Protection Compound-157. Pentadecapeptide for tissue healing and repair research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'TB-500 (Thymosin B4)',
        category: 'Healing / Tissue Repair',
        variants: [
            { id: uuidv4(), size: '5mg', price: 4560, available: true },
            { id: uuidv4(), size: '10mg', price: 8550, available: true },
        ],
        description: 'Thymosin Beta-4 fragment for tissue repair and wound healing research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'BPC + TB Blend',
        category: 'Healing / Tissue Repair',
        variants: [
            { id: uuidv4(), size: '5mg + 5mg', price: 6270, available: true },
            { id: uuidv4(), size: '10mg + 10mg', price: 11400, available: true },
        ],
        description: 'Synergistic blend of BPC-157 and TB-500 for comprehensive tissue repair research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'BPC + GHK-Cu + TB + KPV Blend',
        category: 'Healing / Tissue Repair',
        variants: [
            { id: uuidv4(), size: '50mg combo', price: 14250, available: true },
        ],
        description: 'Multi-peptide healing blend combining BPC-157, GHK-Cu, TB-500, and KPV for advanced repair research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 SKIN / COSMETIC / TANNING
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'MT-2 (Melanotan 2)',
        category: 'Skin / Cosmetic / Tanning',
        variants: [
            { id: uuidv4(), size: '10mg', price: 2850, available: true },
        ],
        description: 'Synthetic melanocortin peptide for tanning and pigmentation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'MT-I',
        category: 'Skin / Cosmetic / Tanning',
        variants: [
            { id: uuidv4(), size: '10mg', price: 3420, available: true },
        ],
        description: 'Melanotan I peptide analog for skin pigmentation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'GHK-Cu',
        category: 'Skin / Cosmetic / Tanning',
        variants: [
            { id: uuidv4(), size: '10mg', price: 4560, available: true },
            { id: uuidv4(), size: '50mg', price: 11400, available: true },
        ],
        description: 'Copper peptide GHK-Cu for skin regeneration and anti-aging research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Snap-8',
        category: 'Skin / Cosmetic / Tanning',
        variants: [
            { id: uuidv4(), size: '10mg', price: 3990, available: true },
        ],
        description: 'Acetyl octapeptide-3 for anti-wrinkle and cosmetic research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'KPV',
        category: 'Skin / Cosmetic / Tanning',
        variants: [
            { id: uuidv4(), size: '10mg', price: 4560, available: true },
        ],
        description: 'Anti-inflammatory tripeptide for skin health and inflammation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'LL-37',
        category: 'Skin / Cosmetic / Tanning',
        variants: [
            { id: uuidv4(), size: '5mg', price: 6840, available: true },
        ],
        description: 'Antimicrobial cathelicidin peptide for skin defense and wound healing research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 COGNITIVE / NEURO RESEARCH
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'Semax',
        category: 'Cognitive / Neuro Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2850, available: true },
            { id: uuidv4(), size: '10mg', price: 3990, available: true },
        ],
        description: 'Nootropic heptapeptide for cognitive enhancement and neuroprotection research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Selank',
        category: 'Cognitive / Neuro Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2850, available: true },
            { id: uuidv4(), size: '10mg', price: 3990, available: true },
        ],
        description: 'Anxiolytic peptide for cognitive and anti-anxiety research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Pinealon',
        category: 'Cognitive / Neuro Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 2565, available: true },
            { id: uuidv4(), size: '10mg', price: 3990, available: true },
            { id: uuidv4(), size: '20mg', price: 5700, available: true },
        ],
        description: 'Short bioregulator peptide for neuroprotection and pineal gland research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'VIP',
        category: 'Cognitive / Neuro Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 5130, available: true },
            { id: uuidv4(), size: '10mg', price: 5700, available: true },
        ],
        description: 'Vasoactive Intestinal Peptide for neuromodulation and immune research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Cerebrolysin',
        category: 'Cognitive / Neuro Research',
        variants: [
            { id: uuidv4(), size: '60mg × 6 vials', price: 1710, available: true },
        ],
        description: 'Neuropeptide preparation for cognitive and neurodegenerative research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 LONGEVITY / MITOCHONDRIAL RESEARCH
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'MOTS-c',
        category: 'Longevity / Mitochondrial Research',
        variants: [
            { id: uuidv4(), size: '10mg', price: 6840, available: true },
        ],
        description: 'Mitochondrial-derived peptide for longevity and metabolic regulation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'SS-31',
        category: 'Longevity / Mitochondrial Research',
        variants: [
            { id: uuidv4(), size: '10mg', price: 5700, available: true },
        ],
        description: 'Mitochondria-targeted peptide (Elamipretide) for mitochondrial function research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Epithalon',
        category: 'Longevity / Mitochondrial Research',
        variants: [
            { id: uuidv4(), size: '10mg', price: 4560, available: true },
        ],
        description: 'Telomerase-activating tetrapeptide for anti-aging and longevity research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'FOXO4-DRI',
        category: 'Longevity / Mitochondrial Research',
        variants: [
            { id: uuidv4(), size: '5mg', price: 11400, available: true },
        ],
        description: 'Senolytic peptide targeting FOXO4 for cellular senescence and longevity research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 HORMONES / FERTILITY / REPRODUCTIVE
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'HCG',
        category: 'Hormones / Fertility / Reproductive',
        variants: [
            { id: uuidv4(), size: '2000iu', price: 5130, available: true },
            { id: uuidv4(), size: '5000iu', price: 10260, available: true },
        ],
        description: 'Human Chorionic Gonadotropin for fertility and reproductive research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'HMG',
        category: 'Hormones / Fertility / Reproductive',
        variants: [
            { id: uuidv4(), size: '75iu', price: 4560, available: true },
        ],
        description: 'Human Menopausal Gonadotropin for fertility and gonadal stimulation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'KissPeptin-10',
        category: 'Hormones / Fertility / Reproductive',
        variants: [
            { id: uuidv4(), size: '5mg', price: 3420, available: true },
            { id: uuidv4(), size: '10mg', price: 6270, available: true },
        ],
        description: 'Kisspeptin peptide for reproductive endocrinology and GnRH signaling research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 SEXUAL WELLNESS
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'PT-141',
        category: 'Sexual Wellness',
        variants: [
            { id: uuidv4(), size: '10mg', price: 5700, available: true },
        ],
        description: 'Bremelanotide for sexual dysfunction and melanocortin receptor research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Oxytocin Acetate',
        category: 'Sexual Wellness',
        variants: [
            { id: uuidv4(), size: '2mg', price: 3420, available: true },
        ],
        description: 'Synthetic oxytocin for bonding, social behavior, and reproductive research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 IMMUNE / INFLAMMATION
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'Thymosin Alpha-1',
        category: 'Immune / Inflammation',
        variants: [
            { id: uuidv4(), size: '5mg', price: 5700, available: true },
            { id: uuidv4(), size: '10mg', price: 10260, available: true },
        ],
        description: 'Immune-modulating peptide for immune function and inflammation research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Thymalin',
        category: 'Immune / Inflammation',
        variants: [
            { id: uuidv4(), size: '10mg', price: 3990, available: true },
        ],
        description: 'Thymic peptide bioregulator for immune system restoration research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Ara-290',
        category: 'Immune / Inflammation',
        variants: [
            { id: uuidv4(), size: '10mg', price: 3990, available: true },
        ],
        description: 'Erythropoietin-derived peptide for anti-inflammatory and tissue protection research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 SLEEP / RECOVERY
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'Melatonin',
        category: 'Sleep / Recovery',
        variants: [
            { id: uuidv4(), size: '10mg', price: 2280, available: true },
        ],
        description: 'Sleep hormone for circadian rhythm and sleep quality research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'DSIP',
        category: 'Sleep / Recovery',
        variants: [
            { id: uuidv4(), size: '5mg', price: 3990, available: true },
        ],
        description: 'Delta Sleep Inducing Peptide for sleep regulation and recovery research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 INJECTABLES / ANTIOXIDANTS / SUPPORT
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'NAD+',
        category: 'Injectables / Antioxidants / Support',
        variants: [
            { id: uuidv4(), size: '50mg', price: 2280, available: true },
            { id: uuidv4(), size: '100mg', price: 3990, available: true },
            { id: uuidv4(), size: '500mg', price: 8550, available: true },
        ],
        description: 'Nicotinamide Adenine Dinucleotide for cellular energy and anti-aging research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Glutathione',
        category: 'Injectables / Antioxidants / Support',
        variants: [
            { id: uuidv4(), size: '1500mg', price: 4560, available: true },
        ],
        description: 'Master antioxidant for detoxification and oxidative stress research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'B12',
        category: 'Injectables / Antioxidants / Support',
        variants: [
            { id: uuidv4(), size: '10ml bottle', price: 1710, available: true },
        ],
        description: 'Vitamin B12 injectable for energy metabolism and neurological research.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'L-Carnitine',
        category: 'Injectables / Antioxidants / Support',
        variants: [
            { id: uuidv4(), size: '10ml', price: 3420, available: true },
        ],
        description: 'Amino acid derivative for fat metabolism and energy production research.',
        available: true,
    },

    // ═══════════════════════════════════════════
    // 🔵 SUPPLIES / DILUENTS
    // ═══════════════════════════════════════════
    {
        id: uuidv4(),
        name: 'BAC Water',
        category: 'Supplies / Diluents',
        variants: [
            { id: uuidv4(), size: '3ml', price: 456, available: true },
            { id: uuidv4(), size: '10ml', price: 570, available: true },
        ],
        description: 'Bacteriostatic water for peptide reconstitution.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Antibacterial Water',
        category: 'Supplies / Diluents',
        variants: [
            { id: uuidv4(), size: '3ml', price: 456, available: true },
            { id: uuidv4(), size: '10ml', price: 570, available: true },
        ],
        description: 'Antibacterial water for sterile reconstitution.',
        available: true,
    },
    {
        id: uuidv4(),
        name: 'Acetic Acid Water',
        category: 'Supplies / Diluents',
        variants: [
            { id: uuidv4(), size: '3ml', price: 456, available: true },
            { id: uuidv4(), size: '10ml', price: 570, available: true },
        ],
        description: 'Acetic acid solution for specialized peptide reconstitution.',
        available: true,
    },
];

export const seedSessions = [
    {
        id: uuidv4(),
        name: 'March 2026 Group Buy',
        startDate: now.toISOString(),
        endDate: sessionEnd.toISOString(),
        status: 'active',
        rules: {
            maxOrdersPerCustomer: 3,
            minimumOrderGoal: 50000,
        },
        createdAt: now.toISOString(),
    },
];

export const seedPaymentMethods = [
    { id: uuidv4(), name: 'Bank Transfer (BDO)', type: 'bank', details: 'BDO Savings Account\nAccount Name: Pre Order Peptide\nAccount No: 1234-5678-9012', enabled: true },
    { id: uuidv4(), name: 'GCash', type: 'ewallet', details: 'GCash Number: 0917-123-4567\nAccount Name: Pre Order Peptide', enabled: true },
    { id: uuidv4(), name: 'Maya', type: 'ewallet', details: 'Maya Number: 0917-765-4321\nAccount Name: Pre Order Peptide', enabled: true },
];

export const seedPaymentRules = {
    fullPaymentRequired: true,
    autoCancelHours: 24,
};
