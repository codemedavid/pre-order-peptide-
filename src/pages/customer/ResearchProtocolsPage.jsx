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
    'TB-500 (Thymosin B4)': {
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
    Retatrutide: {
        fullName: 'Retatrutide (LY-3437943)',
        molecularWeight: '5260 g/mol',
        sequence: 'Triple incretin receptor agonist',
        mechanism: 'A novel triple agonist targeting GIP, GLP-1, and glucagon receptors simultaneously. This tri-agonist approach produces synergistic effects on glucose metabolism, appetite suppression, energy expenditure, and hepatic lipid metabolism, representing the next generation of incretin-based therapies.',
        researchAreas: ['Triple incretin signaling', 'Weight management', 'Hepatic lipid metabolism', 'Metabolic syndrome'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }, { vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL' }], instructions: 'Direct BAC water against vial wall gently. Do not shake — swirl slowly until dissolved.' },
        dosing: [{ phase: 'Initial', range: '1 mg', frequency: 'Once weekly', duration: '4 weeks' }, { phase: 'Titration', range: '2 – 4 mg', frequency: 'Once weekly', duration: '4–8 weeks' }, { phase: 'Moderate', range: '8 mg', frequency: 'Once weekly', duration: '4 weeks' }, { phase: 'Advanced', range: '12 mg', frequency: 'Once weekly', duration: 'Ongoing' }],
        protocol: { loading: 'Weeks 1–4: Start at 1 mg/week subcutaneously. Rotate injection sites.', titration: 'Weeks 5–16: Increase by 2 mg every 4 weeks as tolerated.', maintenance: 'Week 17+: Maintain at 8–12 mg/week based on response.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Do not freeze. Protect from direct light.' },
    },
    Cagrilintide: {
        fullName: 'Cagrilintide',
        molecularWeight: '3950 g/mol',
        sequence: 'Long-acting amylin analogue',
        mechanism: 'A long-acting acylated amylin analogue that activates amylin receptors to slow gastric emptying, reduce glucagon secretion, and promote satiety via central appetite regulation pathways. Designed for once-weekly administration.',
        researchAreas: ['Appetite regulation', 'Gastric motility', 'Amylin signaling', 'Weight management'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '2.5mg', bacWater: '1 mL', concentration: '2.5 mg/mL' }, { vialSize: '5mg', bacWater: '2 mL', concentration: '2.5 mg/mL' }], instructions: 'Add BAC water gently along vial wall. Swirl — do not shake.' },
        dosing: [{ phase: 'Initial', range: '0.25 mg', frequency: 'Once weekly', duration: '4 weeks' }, { phase: 'Titration', range: '0.5 – 1.0 mg', frequency: 'Once weekly', duration: '4–8 weeks' }, { phase: 'Moderate', range: '1.7 mg', frequency: 'Once weekly', duration: '4 weeks' }, { phase: 'Advanced', range: '2.4 mg', frequency: 'Once weekly', duration: 'Ongoing' }],
        protocol: { loading: 'Weeks 1–4: Begin at 0.25 mg/week. Subcutaneous injection.', titration: 'Weeks 5–16: Escalate by 0.25–0.5 mg every 4 weeks.', maintenance: 'Week 17+: Maintain at optimal dose (typically 1.7–2.4 mg/week).' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Do not freeze. Store in original packaging.' },
    },
    'Cagrilintide + Semaglutide': {
        fullName: 'Cagrilintide + Semaglutide (CagriSema)',
        molecularWeight: 'Combination blend',
        sequence: 'Amylin analogue + GLP-1 receptor agonist',
        mechanism: 'Synergistic combination of Cagrilintide (amylin analogue) and Semaglutide (GLP-1 RA). Dual pathway approach targets both amylin and GLP-1 mediated satiety mechanisms, producing additive effects on appetite suppression and metabolic regulation.',
        researchAreas: ['Dual pathway satiety', 'Synergistic weight management', 'Metabolic regulation', 'Combination therapy'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '2.5mg + 2.5mg', bacWater: '1 mL', concentration: '5 mg/mL total' }, { vialSize: '5mg + 5mg', bacWater: '2 mL', concentration: '5 mg/mL total' }], instructions: 'Add BAC water slowly. Swirl gently until fully dissolved. Pre-mixed blend.' },
        dosing: [{ phase: 'Initial', range: '0.25 + 0.25 mg', frequency: 'Once weekly', duration: '4 weeks' }, { phase: 'Titration', range: '0.5 + 0.5 mg', frequency: 'Once weekly', duration: '4–8 weeks' }, { phase: 'Advanced', range: '2.4 + 2.4 mg', frequency: 'Once weekly', duration: 'Ongoing' }],
        protocol: { loading: 'Weeks 1–4: Start at lowest dose to assess tolerance.', titration: 'Weeks 5–16: Increase both components proportionally every 4 weeks.', maintenance: 'Week 17+: Maintain at effective combined dose.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Do not freeze. Blend is pre-combined.' },
    },
    Survodutide: {
        fullName: 'Survodutide (BI 456906)',
        molecularWeight: '4200 g/mol',
        sequence: 'Dual glucagon/GLP-1 receptor agonist',
        mechanism: 'A dual agonist targeting both glucagon and GLP-1 receptors. Glucagon receptor activation increases energy expenditure and hepatic fat oxidation, while GLP-1 receptor activation reduces appetite and improves glycemic control. This combination targets metabolic dysfunction-associated steatohepatitis (MASH).',
        researchAreas: ['Hepatic fat metabolism', 'MASH/NAFLD', 'Energy expenditure', 'Dual receptor signaling'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }, { vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL' }], instructions: 'Direct BAC water gently against vial wall. Swirl slowly.' },
        dosing: [{ phase: 'Initial', range: '0.3 mg', frequency: 'Once weekly', duration: '4 weeks' }, { phase: 'Titration', range: '0.6 – 2.4 mg', frequency: 'Once weekly', duration: '8–12 weeks' }, { phase: 'Advanced', range: '4.8 – 6 mg', frequency: 'Once weekly', duration: 'Ongoing' }],
        protocol: { loading: 'Weeks 1–4: Start at 0.3 mg/week subcutaneously.', titration: 'Weeks 5–16: Double dose every 4 weeks as tolerated.', maintenance: 'Week 17+: Maintain at 4.8–6 mg/week.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Do not freeze. Protect from light.' },
    },
    AOD9604: {
        fullName: 'AOD-9604 (Advanced Obesity Drug)',
        molecularWeight: '1815.08 g/mol',
        sequence: 'HGH Fragment 176-191 (modified)',
        mechanism: 'A modified fragment of human growth hormone (amino acids 176-191) with a tyrosine addition. Stimulates lipolysis and inhibits lipogenesis without affecting IGF-1 levels or insulin resistance. Acts through beta-3 adrenergic receptor pathways in adipose tissue.',
        researchAreas: ['Fat metabolism', 'Lipolysis', 'Anti-lipogenesis', 'Cartilage repair'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }, { vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL' }], instructions: 'Add BAC water gently. Swirl to dissolve. Do not shake.' },
        dosing: [{ phase: 'Low', range: '250 mcg', frequency: 'Daily', duration: 'Ongoing' }, { phase: 'Moderate', range: '300 – 500 mcg', frequency: 'Daily', duration: '8–12 weeks' }, { phase: 'High', range: '500 mcg', frequency: 'Daily (split AM/PM)', duration: '12 weeks' }],
        protocol: { loading: 'Weeks 1–2: 250 mcg daily on empty stomach, subcutaneous in abdominal region.', titration: 'Weeks 3–4: Increase to 300–500 mcg daily if well-tolerated.', maintenance: 'Weeks 5–12: Maintain at 300–500 mcg. Cycle 12 weeks on, 4 weeks off.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: false, notes: 'Stable peptide. Store away from heat.' },
    },
    Adipotide: {
        fullName: 'Adipotide (FTPP)',
        molecularWeight: '2555.22 g/mol',
        sequence: 'Proapoptotic peptidomimetic',
        mechanism: 'Targeted proapoptotic peptide that binds to specific receptors (prohibitin) on the endothelial cells of white adipose tissue vasculature. Induces targeted apoptosis of blood vessels supplying fat cells, leading to rapid adipocyte death and volume reduction.',
        researchAreas: ['Targeted adipocyte apoptosis', 'Adipose vascular targeting', 'Rapid weight reduction'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Slowly add BAC water. Swirl gently to dissolve.' },
        dosing: [{ phase: 'Standard', range: '5 – 10 mg', frequency: 'Daily', duration: '28 days max' }],
        protocol: { loading: 'Not typically loaded.', titration: 'Dosed purely by weight in standard research protocols (e.g., 0.25-0.5 mg/kg).', maintenance: 'Cycle strictly limited to 28 days due to renal clearance demands.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C', lightSensitive: true, notes: 'Requires careful monitoring of renal function during research.' },
    },
    AICAR: {
        fullName: 'AICAR (5-Aminoimidazole-4-carboxamide ribonucleotide)',
        molecularWeight: '258.24 g/mol',
        sequence: 'AMP-activated protein kinase (AMPK) agonist',
        mechanism: 'An analog of AMP that stimulates AMPK activity. Enhances lipid oxidation, increases oxidative phosphorylation, and promotes glucose uptake in skeletal muscle. Acts as a profound exercise mimetic by triggering metabolic pathways normally activated during intense physical exertion.',
        researchAreas: ['Exercise mimetic', 'Endurance enhancement', 'Metabolic regulation', 'Ischemia protection'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '50mg', bacWater: '5 mL', concentration: '10 mg/mL' }], instructions: 'Add BAC water carefully. Dissolves easily into a clear solution.' },
        dosing: [{ phase: 'Standard', range: '10 – 50 mg', frequency: 'Daily or pre-workout', duration: '4–8 weeks' }],
        protocol: { loading: 'Can be initiated at standard dosing.', titration: 'Adjust based on metabolic response and research goals.', maintenance: 'Typically cycled 4-8 weeks to prevent metabolic adaptation.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C', lightSensitive: true, notes: 'Highly stable in lyophilized form.' },
    },
    '5-Amino-1MQ': {
        fullName: '5-Amino-1-methylquinolinium',
        molecularWeight: '194.64 g/mol',
        sequence: 'Small molecule NNMT inhibitor',
        mechanism: 'A selective, membrane-permeable small molecule inhibitor of Nicotinamide N-methyltransferase (NNMT). NNMT is highly expressed in fat tissue. Inhibiting NNMT increases intracellular NAD+ levels, boosting cellular metabolism, increasing energy expenditure, and shrinking white adipocytes.',
        researchAreas: ['NNMT inhibition', 'NAD+ metabolism', 'White adipose reduction', 'Cellular energy'],
        reconstitution: { solvent: 'Not applicable (typically oral caps)', volumes: [{ vialSize: '50mg', bacWater: 'N/A', concentration: 'N/A' }], instructions: 'Typically provided in oral capsule form for research.' },
        dosing: [{ phase: 'Standard', range: '50 – 150 mg', frequency: 'Daily', duration: '4–12 weeks' }],
        protocol: { loading: 'Start at lower end of range (50mg).', titration: 'Increase to 100-150mg daily divided in equal doses.', maintenance: 'Commonly stacked with other metabolic regulators.' },
        storage: { temperature: 'Room temperature', reconstituted: 'N/A', lightSensitive: true, notes: 'Store in a cool, dry place away from light.' },
    },
    'SLU-PP-322': {
        fullName: 'SLU-PP-332',
        molecularWeight: '556.6 g/mol',
        sequence: 'ERRα/ERRγ/ERRβ agonist',
        mechanism: 'A synthetic agonist of estrogen-related receptors (ERRs). Acts as a potent exercise mimetic by reprogramming skeletal muscle metabolism, increasing fatty acid oxidation, and promoting the conversion of white adipose tissue to thermogenic brown adipose tissue without actual physical exertion.',
        researchAreas: ['Exercise substitution', 'Metabolic syndrome', 'Muscle endurance', 'Fatty acid oxidation'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC) / Solvents context dependent', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Follow specific solvent instructions; can be hydrophobic.' },
        dosing: [{ phase: 'Standard', range: 'Varies', frequency: 'Daily', duration: '4–8 weeks' }],
        protocol: { loading: 'Pending standardized human research protocols.', titration: 'Dose-dependent metabolic alterations observed in murine models.', maintenance: 'Cycle dependent on metabolic markers.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate', lightSensitive: true, notes: 'Emerging research compound.' },
    },
    HGH: {
        fullName: 'Human Growth Hormone (Somatropin)',
        molecularWeight: '22,125 g/mol',
        sequence: '191-amino acid single chain polypeptide',
        mechanism: 'Recombinant human growth hormone identical to endogenous GH. Binds to GH receptors to stimulate production of IGF-1 in the liver and other tissues. Promotes systemic growth, cell reproduction, enhanced lipolysis, and protein synthesis.',
        researchAreas: ['Growth hormone axis', 'Body composition', 'Anti-aging/Longevity', 'Tissue recovery'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10iu', bacWater: '1 mL', concentration: '10 iu/mL (1 iu = 0.1 mL)' }, { vialSize: '20iu', bacWater: '2 mL', concentration: '10 iu/mL' }], instructions: 'Direct BAC water very gently against vial wall. Swirl extremely slowly. GH is fragile and easily damaged by agitation.' },
        dosing: [{ phase: 'Anti-Aging', range: '1 – 2 iu', frequency: 'Daily', duration: 'Ongoing' }, { phase: 'Replacement', range: '2 – 3 iu', frequency: 'Daily', duration: 'Ongoing' }, { phase: 'Advanced', range: '4 – 8+ iu', frequency: 'Daily (split)', duration: 'Cycles vary' }],
        protocol: { loading: 'Not required. Start at target dose.', titration: 'Increase by 0.5-1 iu every 2-4 weeks to assess tolerance/side effects.', maintenance: 'Commonly administered subcutaneously fasting AM or pre-bed to mimic natural pulse.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 21-28 days.', lightSensitive: true, notes: 'Highly fragile. Do not shake or drop vial. Store constantly refrigerated.' },
    },
    'HGH Fragment 176-191': {
        fullName: 'HGH Fragment 176-191',
        molecularWeight: '1815.1 g/mol',
        sequence: 'Tyr-hGH (177-191)',
        mechanism: 'A synthetic stabilized fragment of the tail end (amino acids 176-191) of the human growth hormone molecule. It targets specifically the lipolytic (fat burning) properties of HGH without stimulating IGF-1 production, insulin resistance, or cellular growth pathways.',
        researchAreas: ['Targeted lipolysis', 'Fat metabolism', 'Obesity research'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL (200 mcg per 0.1 mL)' }], instructions: 'Add BAC water along the wall. Swirl gently to dissolve.' },
        dosing: [{ phase: 'Standard', range: '250 – 500 mcg', frequency: '1-2x Daily', duration: '8–12 weeks' }],
        protocol: { loading: 'Weeks 1-2: 250 mcg daily, ideally fasted prior to cardiovascular activity.', titration: 'Weeks 3+: Can split dose 250 mcg AM and 250 mcg PM (fasted).', maintenance: 'Requires strict fasting (no carbohydrates/insulin spikes for 2-3 hours post-injection) for efficacy.' },
        storage: { temperature: '2–8°C (refrigerated)', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Protect from heat and light.' },
    },
    'CJC-1295 Without DAC': {
        fullName: 'CJC-1295 Without DAC (Modified GRF 1-29)',
        molecularWeight: '3367.9 g/mol',
        sequence: 'Modified Growth Hormone Releasing Factor',
        mechanism: 'A synthetic analogue of endogenous Growth Hormone Releasing Hormone (GHRH). It consists of the first 29 amino acids of GHRH modified to enhance stability and half-life (approx 30 mins) without continuous long-acting release. Stimulates the pituitary gland to release a physiological pulse of growth hormone.',
        researchAreas: ['Growth hormone secretagogue', 'Pulsatile GH release', 'Anti-aging'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Inject BAC water gently down vial wall. Slow swirl.' },
        dosing: [{ phase: 'Standard', range: '100 mcg', frequency: '1-3x Daily', duration: '12+ weeks' }],
        protocol: { loading: 'Start at 100 mcg per dose.', titration: 'Dose remains static, frequency can increase (up to 3x daily).', maintenance: 'Administer subcutaneously on an empty stomach (2 hours post/1 hour pre-food). Often stacked perfectly with Ipamorelin.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21-28 days.', lightSensitive: true, notes: 'Wait 30 mins before eating post-injection.' },
    },
    'CJC-1295 With DAC': {
        fullName: 'CJC-1295 With DAC',
        molecularWeight: '3367.9 + Drug Affinity Complex',
        sequence: 'Mod GRF 1-29 + Drug Affinity Complex',
        mechanism: 'Modified GRF 1-29 bonded to a Drug Affinity Complex (DAC), which binds to endogenous serum albumin. This drastically extends the half-life to approximately 8 days, causing a continuous, non-pulsatile secretion of growth hormone rather than mimicking physiological pulses.',
        researchAreas: ['Sustained GH release', 'Extended longevity profiles', 'IGF-1 elevation'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2 mL', concentration: '2.5 mg/mL' }], instructions: 'Add BAC water gently. Allow to dissolve.' },
        dosing: [{ phase: 'Standard', range: '1 – 2 mg', frequency: 'Once weekly', duration: '8–12 weeks' }],
        protocol: { loading: 'Usually starting at 1 mg to assess tolerance.', titration: 'Can increase to 2 mg weekly.', maintenance: 'Administered once or twice weekly due to extended half-life.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Continuous GH release may affect natural pituitary function faster than non-DAC versions.' },
    },
    'CJC-1295 + Ipamorelin': {
        fullName: 'CJC-1295 / Ipamorelin Blend',
        molecularWeight: 'Blend (3367.9 + 711.8 g/mol)',
        sequence: 'GHRH analogue + GHRP analogue',
        mechanism: 'Synergistic combination of a Growth Hormone Releasing Hormone analogue (CJC-1295 No DAC) and a Growth Hormone Releasing Peptide (Ipamorelin). This creates a "bleed and squeeze" effect—CJC increases the basal amount of GH released per pulse, while Ipamorelin increases the strength and frequency of the pulse, maximizing natural GH production.',
        researchAreas: ['Synergistic GH release', 'Body composition', 'Anti-aging/Longevity', 'Recovery enhancement'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg + 5mg (10mg total)', bacWater: '2 mL', concentration: '5 mg/mL total' }], instructions: 'Slowly direct BAC water against the inner vial wall. Swirl gently.' },
        dosing: [{ phase: 'Standard', range: '100mcg/100mcg to 300mcg/300mcg', frequency: '1-2x Daily', duration: '12-16 weeks' }],
        protocol: { loading: 'Start at lower end of dosing (100mcg of each).', titration: 'Can be titrated up to 300mcg of each twice daily.', maintenance: 'Administer strictly on an empty stomach to avoid insulin blunting the GH pulse.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Protect from light and heat.' },
    },
    Ipamorelin: {
        fullName: 'Ipamorelin',
        molecularWeight: '711.85 g/mol',
        sequence: 'Aib-His-D-2-Nal-D-Phe-Lys-NH2',
        mechanism: 'A selective pentapeptide Growth Hormone Secretagogue (GHS) that mimics ghrelin to bind to the ghrelin/GHS receptor. Known for being the most "selective" GH peptide, it strongly stimulates a large, natural pulse of growth hormone without significantly elevating cortisol, prolactin, or aldosterone levels.',
        researchAreas: ['Selective GH stimulation', 'Sleep architect research', 'Bone density', 'Body composition'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Add BAC water down the side. Allow to dissolve cleanly.' },
        dosing: [{ phase: 'Standard', range: '200 – 300 mcg', frequency: '1-2x Daily', duration: '12+ weeks' }],
        protocol: { loading: 'Start at 200 mcg before bed.', titration: 'Increase to 300 mcg or add an AM fasted dose.', maintenance: 'Commonly cycled 5 days on, 2 days off to prevent receptor attenuation.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Very stable peptide in solution compared to others.' },
    },
    Hexarelin: {
        fullName: 'Hexarelin',
        molecularWeight: '887.0 g/mol',
        sequence: 'His-D-2-methyl-Trp-Ala-Trp-D-Phe-Lys-NH2',
        mechanism: 'A potent synthetic hexapeptide growth hormone secretagogue. It is considered the strongest of the GHRP class, causing a massive, rapid release of growth hormone. However, unlike Ipamorelin, it can elevate prolactin and cortisol and causes faster receptor desensitization.',
        researchAreas: ['Maximal GH stimulation', 'Cardioprotection', 'Muscle hypertrophy modeling'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '2mg', bacWater: '1 mL', concentration: '2 mg/mL' }, { vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Standard reconstitution. Add water gently.' },
        dosing: [{ phase: 'Standard', range: '100 – 200 mcg', frequency: '1-3x Daily', duration: '4-8 weeks max' }],
        protocol: { loading: 'Start low (100 mcg) due to potency and potential for flushing/nausea.', titration: 'Titrate to 200 mcg per dose maximum.', maintenance: 'Strict cycles of 4-6 weeks are required to prevent severe receptor desensitization.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Use with caution; monitor for prolactin elevation.' },
    },
    Tesamorelin: {
        fullName: 'Tesamorelin',
        molecularWeight: '3367.9 + 172.2 g/mol',
        sequence: 'Trans-3-Hexenoic Acid-Mod GRF 1-29',
        mechanism: 'A synthetic analogue of Growth Hormone Releasing Hormone (GHRH) with a trans-3-hexenoic acid group added to the N-terminus to increase stability. It possesses a uniquely strong affinity for lipolytic pathways, specifically targeting visceral adipose tissue (visceral fat) reduction while elevating basal GH levels.',
        researchAreas: ['Visceral adiposity', 'Lipodystrophy', 'Metabolic syndrome', 'GH axis modulation'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC) or Sterile Water', volumes: [{ vialSize: '2mg', bacWater: '1 mL', concentration: '2 mg/mL' }, { vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL' }], instructions: 'Add diluent slowly. Swirl gently. Wait until completely clear before use.' },
        dosing: [{ phase: 'Standard', range: '1 – 2 mg', frequency: 'Daily', duration: '12-24 weeks' }],
        protocol: { loading: 'Standard loading not typical. Begin at 1mg.', titration: 'Standard protocol in clinical environments is 2mg daily.', maintenance: 'Administer subcutaneously in the abdomen, rotating daily.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 14 days.', lightSensitive: true, notes: 'More delicate in solution than other GHRHs. Reconstitute only what is needed short-term.' },
    },
    'Sermorelin Acetate': {
        fullName: 'Sermorelin Acetate',
        molecularWeight: '3357.9 g/mol',
        sequence: 'GHRH (1-29) NH2',
        mechanism: 'The shortest synthetic version of naturally occurring Growth Hormone Releasing Hormone (GHRH) consisting of the first 29 amino acids. It stimulates the pituitary to naturally secrete more HGH. It is rapidly broken down by the body (very short half-life).',
        researchAreas: ['GH stimulation', 'Anti-aging diagnostics', 'Pituitary function'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Add BAC water carefully. Dissolves quickly.' },
        dosing: [{ phase: 'Standard', range: '200 – 500 mcg', frequency: 'Daily (before bed)', duration: '12+ weeks' }],
        protocol: { loading: 'Start at 200 mcg before bed.', titration: 'Increase slowly up to 500 mcg.', maintenance: 'Must be administered immediately prior to sleep for maximal effect mimicking natural pulses.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Often superseded by CJC-1295 due to longer half-life, but remains popular for diagnostic use.' },
    },
    'IGF-1 LR3': {
        fullName: 'Long R3 Insulin-like Growth Factor-1',
        molecularWeight: '9111.6 g/mol',
        sequence: '83-amino acid analogue of human IGF-1',
        mechanism: 'A modified version of human Insulin-Like Growth Factor-1. The arginine substitution (R3) and 13-amino acid extension (Long) prevent it from binding to IGF binding proteins (IGFBPs). This massively increases its half-life (20-30 hours) and potency (2-3x stronger than standard IGF-1). Promotes severe hyperplasia (new muscle cell creation) and nutrient shuttling.',
        researchAreas: ['Hyperplasia', 'Muscle cell differentiation', 'Anabolic nutrient partitioning', 'Nerve regeneration'],
        reconstitution: { solvent: 'Acetic Acid (0.6%) & BAC Water', volumes: [{ vialSize: '1mg', bacWater: '1 mL (AA)', concentration: '1000 mcg/mL' }], instructions: 'Advanced: Reconstitute vial with tiny amount of 0.6% Acetic Acid to maintain stability, then dilute individual doses with BAC water in syringe before injection.' },
        dosing: [{ phase: 'Standard', range: '20 – 50 mcg', frequency: 'Daily or pre/post-workout', duration: '4-6 weeks max' }],
        protocol: { loading: 'Start very low (20 mcg) due to profound hypoglycemic risk.', titration: 'Increase slowly to 50 mcg maximum.', maintenance: 'Strict 4-6 week cycles to prevent organ hyperplasia. Consume heavy carbohydrates immediately post-injection to prevent hypoglycemia and shuttle nutrients.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate with AA. Reconstituted in AA, stable for months.', lightSensitive: true, notes: 'WARNING: Extreme risk of severe hypoglycemia. Requires carbohydrate intake. Requires specific AA reconstitution protocols.' },
    },
    'IGF-DES': {
        fullName: 'IGF-1 DES (1-3)',
        molecularWeight: '8820 g/mol',
        sequence: 'Truncated IGF-1 (cleaved first 3 a.a.)',
        mechanism: 'A naturally occurring truncated version of IGF-1 lacking the first three amino acids at the N-terminus. It does not bind well to IGFBPs, making it fast-acting and highly potent. Unlike LR3, which is systemic, DES is highly localized to the injection site, driving rapid, acute cellular growth pathways precisely where administered.',
        researchAreas: ['Localized hyperplasia', 'Site-specific tissue enhancement', 'Lactic acid metabolism', 'Acute repair'],
        reconstitution: { solvent: 'Acetic Acid (0.6%) & BAC Water', volumes: [{ vialSize: '1mg', bacWater: '1 mL (AA)', concentration: '1000 mcg/mL' }], instructions: 'See IGF-1 LR3 instructions. Requires Acetic Acid for stability.' },
        dosing: [{ phase: 'Standard', range: '20 – 40 mcg', frequency: 'Pre-workout (localized)', duration: '4-6 weeks' }],
        protocol: { loading: 'Begin at 20 mcg.', titration: 'Can dose up to 40 mcg.', maintenance: 'Administered intramuscularly (IM) into specific target tissues requiring hyperplasia. Short half-life (20-30 mins).' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate. Stable in AA.', lightSensitive: true, notes: 'WARNING: Targeted localization requires precise IM injection protocols. Hypoglycemia risk.' },
    },
    'BPC + TB Blend': {
        fullName: 'BPC-157 / TB-500 Repair Blend',
        molecularWeight: 'Blend (1419.5 + 4921.0 g/mol)',
        sequence: 'BPC-157 + Thymosin Beta-4 fragment',
        mechanism: 'The premier synergistic healing protocol. BPC-157 promotes angiogenesis (new blood vessel formation) via VEGF pathways and acts systemically/locally. TB-500 upregulates actin, promoting rapid cellular migration to injury sites. Together, they create an optimized environment for tendon, ligament, and muscle repair.',
        researchAreas: ['Acute sports injuries', 'Post-operative recovery', 'Tendon/Ligament reconstruction', 'Systemic inflammation'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg + 5mg (10mg total)', bacWater: '2 mL', concentration: '5 mg/mL total' }, { vialSize: '10mg + 10mg (20mg total)', bacWater: '4 mL', concentration: '5 mg/mL total' }], instructions: 'Direct BAC water along the vial wall. Swirl gently until clear.' },
        dosing: [{ phase: 'Acute', range: '500mcg/500mcg', frequency: 'Daily', duration: '2-4 weeks' }, { phase: 'Maintenance', range: '250mcg/250mcg', frequency: 'Daily or Every Other Day', duration: '4-8 weeks' }],
        protocol: { loading: 'Weeks 1-2: 500 mcg of the blend (containing 250mcg BPC/250mcg TB) inject subcutaneously near injury site twice daily (AM/PM).', titration: 'Weeks 3-4: Reduce to once daily based on recovery rate.', maintenance: 'Common 4-6 week cycle. Can be run systemically (abdomen) if local administration is not feasible.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Avoid repeated freeze-thaw.' },
    },
    'BPC + GHK-Cu + TB + KPV Blend': {
        fullName: 'Wolverine Healing Blend (BPC/GHK/TB/KPV)',
        molecularWeight: 'Complex Multi-Peptide Blend',
        sequence: 'Four-component synergistic repair matrix',
        mechanism: 'An advanced, comprehensive tissue repair and anti-inflammatory matrix. Combines angiogenesis (BPC-157), cellular migration (TB-500), extracellular matrix remodeling/collagen synthesis (GHK-Cu), and potent systemic mast-cell/gut inflammation reduction (KPV). Designed for severe acute injury recovery and complex systemic repair.',
        researchAreas: ['Maximal tissue regeneration', 'Surgical recovery', 'Complex systemic inflammation', 'Burn wound healing'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '50mg combo', bacWater: '5 mL', concentration: '10 mg/mL total blend' }], instructions: 'Slowly direct BAC water against the wall. Swirl gently. Solution will have a blue/purple tint due to GHK-Cu component.' },
        dosing: [{ phase: 'Intensive', range: '1 – 2 mg (total blend)', frequency: 'Daily', duration: '4 weeks' }, { phase: 'Maintenance', range: '0.5 – 1 mg', frequency: 'Daily', duration: '4-8 weeks' }],
        protocol: { loading: 'Weeks 1-4: 1-2 mg total blend daily injected subcutaneously. Often split into AM/PM doses for consistency.', titration: 'Weeks 5-8: Reduce dose by half as acute inflammation subsides.', maintenance: 'Strict cycles of 8 weeks maximum to prevent immune/inflammatory pathway exhaustion.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21-28 days.', lightSensitive: true, notes: 'Blue coloration is normal. Contains copper; monitor systemic copper status if running extended protocols.' },
    },
    'MT-2 (Melanotan 2)': {
        fullName: 'Melanotan II',
        molecularWeight: '1024.2 g/mol',
        sequence: 'Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2',
        mechanism: 'A synthetic analogue of alpha-melanocyte-stimulating hormone (α-MSH). Non-selective agonist of melanocortin receptors (MC1, MC3, MC4, MC5). MC1 activation stimulates melanogenesis (tanning) without UV exposure, while MC3/MC4 activation provides profound libido enhancement and appetite suppression.',
        researchAreas: ['Melanogenesis', 'Erectile dysfunction', 'Appetite regulation', 'UV protection mechanisms'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Inject BAC water against the vial wall. Swirl gently.' },
        dosing: [{ phase: 'Loading', range: '250 mcg', frequency: 'Daily', duration: '1-2 weeks' }, { phase: 'Maintenance', range: '500 mcg', frequency: '1-2x Weekly', duration: 'Ongoing' }],
        protocol: { loading: 'Weeks 1-2: 250 mcg daily right before bed (to mitigate nausea). UV exposure accelerates effects but is not strictly necessary.', titration: 'Increase to 500 mcg if well-tolerated.', maintenance: 'Maintain color with 500 mcg once or twice weekly.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Can cause initial nausea and flushing. Monitor for hyperpigmentation of moles/freckles.' },
    },
    'MT-I': {
        fullName: 'Melanotan I (Afamelanotide)',
        molecularWeight: '1087.2 g/mol',
        sequence: 'Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2',
        mechanism: 'A synthetic analogue of α-MSH that is highly selective for the MC1 receptor. Unlike MT-2, it almost exclusively promotes melanogenesis (skin darkening) and provides photoprotection without crossing the blood-brain barrier to cause libido enhancement or significant appetite suppression.',
        researchAreas: ['Erythropoietic protoporphyria (EPP)', 'Photoprotection', 'Selective melanogenesis'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Add BAC water carefully. Dissolves easily.' },
        dosing: [{ phase: 'Standard', range: '1 – 2 mg', frequency: 'Daily', duration: '2-3 weeks' }],
        protocol: { loading: 'Requires higher doses than MT-2. Begin at 1 mg daily subcutaneously.', titration: 'Can increase to 2 mg daily for faster melanogenesis.', maintenance: 'Requires more frequent dosing for maintenance compared to MT-2 due to shorter half-life and lower potency.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Significantly fewer side effects (nausea/libido) compared to MT-2.' },
    },
    'Snap-8': {
        fullName: 'Acetyl Octapeptide-3 (SNAP-8)',
        molecularWeight: '1075.2 g/mol',
        sequence: 'Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2',
        mechanism: 'An elongation of the famous hexapeptide Argireline. It competes with natural proteins to bind to the SNARE complex, destabilizing its formation. This prevents the release of acetylcholine at the neuromuscular junction, mildly inhibiting muscle contractions to reduce dynamic wrinkles natively.',
        researchAreas: ['Cosmeceuticals', 'Botulinum toxin alternatives', 'Dermal fibroblast relaxation'],
        reconstitution: { solvent: 'Standard formulation bases / BAC', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Often compounded into topical serums (e.g., 2-10% concentration) rather than injected in research.' },
        dosing: [{ phase: 'Topical', range: '2 – 10% solution', frequency: 'Twice daily', duration: 'Ongoing' }],
        protocol: { loading: 'Not applicable for topical application.', titration: 'Apply 1-2 drops of compounded serum to areas of dynamic wrinkles (forehead, crow\'s feet).', maintenance: 'Continuous daily application required to maintain effects.' },
        storage: { temperature: 'Room Temp / 2-8°C', reconstituted: 'Refrigerate if in water; stable in formulated bases.', lightSensitive: true, notes: 'Generally researched as a topical application, not systemic.' },
    },
    KPV: {
        fullName: 'Lysine-Proline-Valine (KPV)',
        molecularWeight: '383.5 g/mol',
        sequence: 'Lys-Pro-Val',
        mechanism: 'A naturally occurring tripeptide that forms the C-terminal sequence of alpha-MSH. It possesses potent anti-inflammatory and anti-microbial properties without any melanotropic (tanning) activity. It exerts effects inside the cell by inactivating inflammatory pathways (NF-kB) and stabilizing mast cells.',
        researchAreas: ['Systemic inflammation', 'Gut health (IBD/IBS)', 'Psoriasis/Eczema', 'Mast cell activation'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '5 mL', concentration: '2 mg/mL' }], instructions: 'Direct BAC water along vial wall. Swirl gently.' },
        dosing: [{ phase: 'Standard', range: '200 – 500 mcg', frequency: 'Daily', duration: '4-8 weeks' }],
        protocol: { loading: 'Start at 200 mcg daily injected subcutaneously.', titration: 'Increase to 500 mcg daily for severe inflammatory models.', maintenance: 'Can be formulated into oral capsules for targeted gut research or topical creams for skin inflammation.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: false, notes: 'Highly stable peptide in various formulations.' },
    },
    'LL-37': {
        fullName: 'Cathelicidin Antimicrobial Peptide (LL-37)',
        molecularWeight: '4493.3 g/mol',
        sequence: '37-amino acid cationic peptide',
        mechanism: 'The only known human cathelicidin. An endogenous antimicrobial peptide that directly destroys the cell membranes of bacteria, enveloped viruses, and fungi. Additionally, it modulates natural innate immune responses and promotes angiogenesis and wound healing.',
        researchAreas: ['Chronic biofilm infections', 'Autoimmune modulation', 'Wound healing', 'Lyme disease protocols'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '5 mL', concentration: '1 mg/mL' }], instructions: 'Add BAC water very slowly. Swirl gently. Prone to foaming.' },
        dosing: [{ phase: 'Low', range: '100 – 150 mcg', frequency: 'Daily', duration: '4-6 weeks' }],
        protocol: { loading: 'Start very low (50-100 mcg) to assess die-off (Herxheimer) reactions in infectious models.', titration: 'Increase cautiously to 150-200 mcg max.', maintenance: 'Strict pulsed cycles (e.g., 4 weeks on, 4 weeks off) to prevent induction of systemic resistance or excessive mast cell degranulation.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'WARNING: Potent immune modulator. Can cause significant Herxheimer (die-off) reactions.' },
    },
    Semax: {
        fullName: 'Semax',
        molecularWeight: '813.9 g/mol',
        sequence: 'Met-Glu-His-Phe-Pro-Gly-Pro',
        mechanism: 'A synthetic heptapeptide analogue of a fragment of adrenocorticotropic hormone (ACTH 4-10). Functions as a potent nootropic and neuroprotective agent. It rapidly elevates Brain-Derived Neurotrophic Factor (BDNF) and TrkB receptor expression, enhancing neuroplasticity and cognitive function without stimulant effects.',
        researchAreas: ['Cognitive enhancement', 'Neuroprotection (stroke/TBI)', 'ADHD modulation', 'Optic nerve preservation'],
        reconstitution: { solvent: 'Sterile Water or BAC', volumes: [{ vialSize: '5mg', bacWater: '5 mL', concentration: '1 mg/mL' }], instructions: 'Often administered via nasal spray formulation in research. If subcutaneous: standard BAC reconstitution.' },
        dosing: [{ phase: 'Nootropic', range: '200 – 400 mcg', frequency: 'Daily (AM)', duration: '1-3 months' }],
        protocol: { loading: 'Can begin at 200 mcg daily.', titration: 'Increase to 400 mcg if needed. Intranasal administration provides fastest systemic access across the blood-brain barrier.', maintenance: 'Best cycled 1 month on, 1 month off.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 2-3 weeks.', lightSensitive: true, notes: 'Very delicate peptide; avoid agitation.' },
    },
    Selank: {
        fullName: 'Selank',
        molecularWeight: '1046.2 g/mol',
        sequence: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro',
        mechanism: 'A synthetic heptapeptide analogue of the naturally occurring peptide tuftsin. Acts as an anxiolytic (anti-anxiety) and nootropic. It modulating the expression of interleukin-6 (IL-6) and balances the degradation of enkephalins (natural painkillers/mood elevators) in the blood serum.',
        researchAreas: ['Anxiety reduction', 'Cognitive stabilization', 'Immune modulation', 'Stress response'],
        reconstitution: { solvent: 'Sterile Water or BAC', volumes: [{ vialSize: '5mg', bacWater: '5 mL', concentration: '1 mg/mL' }], instructions: 'Similar to Semax; often prepared as intranasal.' },
        dosing: [{ phase: 'Anxiolytic', range: '250 – 500 mcg', frequency: '1-2x Daily', duration: '2-4 weeks' }],
        protocol: { loading: 'Start at 250 mcg during times of high stress.', titration: 'Can dose up to 500 mcg twice daily.', maintenance: 'Short cycles (10-14 days) are often sufficient for acute stress regulation.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 2-3 weeks.', lightSensitive: true, notes: 'Not sedative; preserves cognitive clarity while reducing anxiety.' },
    },
    Pinealon: {
        fullName: 'Pinealon',
        molecularWeight: '318.3 g/mol',
        sequence: 'Glu-Asp-Arg',
        mechanism: 'A short bio-regulator peptide that interacts directly with DNA to normalize the functional activity of brain cells. It specifically targets the pineal gland and central nervous system to protect neurons from oxidative stress, improve cellular metabolism, and regulate circadian rhythms.',
        researchAreas: ['Neuro-bioregulation', 'TBI/Concussion repair', 'Circadian rhythm optimization', 'Cognitive decline'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2 mL', concentration: '2.5 mg/mL' }], instructions: 'Dissolves easily. Swirl gently.' },
        dosing: [{ phase: 'Intensive', range: '1 – 2 mg', frequency: 'Daily', duration: '10-20 days' }],
        protocol: { loading: 'Standard bio-regulator protocol: 10mg total administered over 10 days (1mg/day).', titration: 'Not typically titrated. Flat dosing structure.', maintenance: 'Cycle 1-2 times per year. Effects are long-lasting after cycle completion.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Different paradigm than typical peptides; operates via epigenetic modulation.' },
    },
    VIP: {
        fullName: 'Vasoactive Intestinal Peptide (VIP)',
        molecularWeight: '3325.8 g/mol',
        sequence: '28-amino acid neuropeptide',
        mechanism: 'A potent endogenous neuropeptide functioning as a neuromodulator and neurotransmitter. Induces extensive systemic vasodilation, profound anti-inflammatory effects (blocks pro-inflammatory cytokines like TNF-a), and regulates circadian rhythms in the suprachiasmatic nucleus. Crucial in CIRS (Chronic Inflammatory Response Syndrome) treatment.',
        researchAreas: ['CIRS / Mold toxicity', 'Systemic vasodilation', 'Neuroinflammation', 'Pulmonary hypertension'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC) / Saline', volumes: [{ vialSize: '5mg', bacWater: '5 mL', concentration: '1 mg/mL' }], instructions: 'Commonly formulated as an intranasal spray (e.g., 50mcg per spray) for direct CNS access.' },
        dosing: [{ phase: 'Standard', range: '50 – 100 mcg', frequency: '1-4x Daily (Intranasal)', duration: 'Months' }],
        protocol: { loading: 'Must verify environment is clear of biotoxins (mold) before initiation, or it will be ineffective.', titration: 'Increase frequency of intranasal sprays up to 4x daily.', maintenance: 'Strict, long-term protocol requiring careful monitoring of inflammatory markers (TGF-b1, MMP9, VEGF).' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C.', lightSensitive: true, notes: 'Do NOT use if the patient/subject is still in a biotoxin/mold-exposed environment.' },
    },
    Cerebrolysin: {
        fullName: 'Cerebrolysin',
        molecularWeight: 'Mixture of small peptides/amino acids',
        sequence: 'Purified porcine brain proteins',
        mechanism: 'A multi-modal neuropeptide preparation consisting of low molecular weight peptides (like BDNF, GDNF, NGF fragments) and free amino acids. It acts like an endogenous neurotrophic factor to promote neurogenesis, neuronal survival, and synaptic plasticity. The only neuro-agent shown to improve long-term outcomes in stroke and severe TBI.',
        researchAreas: ['Stroke recovery', 'Traumatic Brain Injury', 'Dementia/Alzheimer\'s', 'Severe cognitive enhancement'],
        reconstitution: { solvent: 'Pre-mixed ampoules', volumes: [{ vialSize: 'Varies (e.g., 10mL ampoule)', bacWater: 'N/A', concentration: 'Pre-mixed' }], instructions: 'Comes pre-formulated in glass ampoules. Do not dilute unless giving via IV drip (dilute in normal saline).' },
        dosing: [{ phase: 'Mild/Nootropic', range: '5 – 10 mL', frequency: 'Daily or 5x/week IM', duration: '4 weeks' }, { phase: 'Severe (Stroke/TBI)', range: '20 – 50 mL', frequency: 'Daily via IV', duration: '10-21 days' }],
        protocol: { loading: 'No loading. Dose depends entirely on severity of condition.', titration: 'Given via intramuscular (IM) injection (up to 5mL per site) or intravenous (IV) infusion for higher doses.', maintenance: 'Typically cycled. E.g., 4 weeks on, 2-3 months off.' },
        storage: { temperature: 'Room Temp (below 25°C)', reconstituted: 'Ampoule must be used immediately upon opening.', lightSensitive: true, notes: 'Requires proper ampoule breaker. Strict sterile technique required.' },
    },
    'MOTS-c': {
        fullName: 'Mitochondrial Open Reading Frame of the 12S rRNA-c',
        molecularWeight: '2174.6 g/mol',
        sequence: 'Mitochondrial-derived peptide',
        mechanism: 'A unique peptide encoded not in the cell nucleus, but entirely within mitochondrial DNA. It targets skeletal muscle to promote metabolic homeostasis, activates AMPK, increases NAD+ levels, and drives profound cellular fatty acid oxidation. It effectively mimics the metabolic effects of exercise on a cellular level.',
        researchAreas: ['Mitochondrial dysfunction', 'Metabolic flexibility', 'Exercise mimetic', 'Longevity enhancement'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Add BAC water gently. Swirl to dissolve.' },
        dosing: [{ phase: 'Active', range: '5 – 10 mg', frequency: '2-3x Weekly', duration: '4-6 weeks' }],
        protocol: { loading: '10 mg injected subcutaneously right before cardiovascular exercise yields maximal mitochondrial up-regulation.', titration: 'Can dose 5mg if injected daily, but 10mg 2x/week pre-workout is standard.', maintenance: 'Cycled (e.g., 4 weeks on, 8 weeks off).' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 14 days.', lightSensitive: true, notes: 'For best results, must be paired with physical exercise (AMPK synergy).' },
    },
    'SS-31': {
        fullName: 'Elamipretide (SS-31)',
        molecularWeight: '639.8 g/mol',
        sequence: 'D-Arg-dimethylTyr-Lys-Phe-NH2',
        mechanism: 'A first-in-class mitochondrially targeted tetrapeptide. It selectively localizes to the inner mitochondrial membrane where it binds to cardiolipin, stabilizing mitochondrial structure and optimizing the electron transport chain. This drastically reduces reactive oxygen species (ROS) leakage and restores ATP production in dysfunctional mitochondria.',
        researchAreas: ['Mitochondrial disease', 'Heart failure optimization', 'Ischemia-reperfusion injury', 'Aging reversal'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Add BAC gently. Swirl to dissolve.' },
        dosing: [{ phase: 'Intensive', range: '2 – 4 mg', frequency: 'Daily', duration: '4-8 weeks' }],
        protocol: { loading: 'Typically started at 2 mg daily via subcutaneous injection.', titration: 'Can be increased to 4 mg daily in models of severe mitochondrial dysfunction.', maintenance: 'Often used prior to beginning NAD+ precursor or MOTS-c protocols to "repair" the mitochondria before "driving" them.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Requires high-quality synthesizing specific to mitochondrial membrane penetration.' },
    },
    Epithalon: {
        fullName: 'Epithalon (Epitalon)',
        molecularWeight: '390.4 g/mol',
        sequence: 'Ala-Glu-Asp-Gly',
        mechanism: 'A synthetic pineal gland bio-regulator tetrapeptide. Discovered to massively up-regulate the production of the enzyme telomerase in cells. Telomerase repairs and elongates telomeres (the protective caps on DNA), which shorten as we age. It also aggressively normalizes melatonin production and circadian rhythms.',
        researchAreas: ['Telomere elongation', 'Extreme life extension protocols', 'Circadian repair', 'Retinitis pigmentosa'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Dissolves very easily.' },
        dosing: [{ phase: 'Khavinson Protocol', range: '10 mg', frequency: 'Daily', duration: '10 days' }],
        protocol: { loading: 'The standard "Khavinson Protocol" is 100mg total: 10mg injected daily (or 5mg AM / 5mg PM) for 10 consecutive days.', titration: 'None. Flat dosing structure.', maintenance: 'Protocol is repeated 1-2 times per year globally to maintain telomere length.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Very stable peptide. One of the most researched longevity compounds.' },
    },
    'FOXO4-DRI': {
        fullName: 'FOXO4 D-Retro-Inverso',
        molecularWeight: '~5000 g/mol',
        sequence: 'D-amino acid modified FOXO4 fragment',
        mechanism: 'A potent senolytic peptide designed in the D-Retro-Inverso (DRI) configuration to prevent enzymatic breakdown. It selectively targets "senescent" (zombie) cells that have stopped dividing but refuse to die, secreting toxic inflammatory cytokines. FOXO4-DRI forces these specific zombie cells into apoptosis (death) without harming healthy cells.',
        researchAreas: ['Targeted senolysis', 'Aging reversal', 'Chemotherapy recovery', 'Cellular rejuvenation'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Dissolve carefully. Very delicate molecule.' },
        dosing: [{ phase: 'Senolytic Cycle', range: '2 – 3 mg', frequency: 'Every Other Day (EOD)', duration: '6 days (3 doses total)' }],
        protocol: { loading: 'Not loaded. Administered in extremely short, highly aggressive bursts called "hit-and-run" senolysis.', titration: 'Typically 2-3 mg administered every other day for exactly three doses (e.g., Mon, Wed, Fri).', maintenance: 'This 3-dose cycle is done only once every 3 to 6 months to clear out accumulated senescent cells.' },
        storage: { temperature: '2–8°C / -20°C', reconstituted: 'Refrigerate immediately. Very short shelf-life reconstituted (use within days).', lightSensitive: true, notes: 'EXTREMELY POTENT. Do not run continuously. Doing so risks impairing healthy wound healing pathways.' },
    },
    HCG: {
        fullName: 'Human Chorionic Gonadotropin (hCG)',
        molecularWeight: '36,700 g/mol',
        sequence: 'Glycoprotein hormone',
        mechanism: 'A glycoprotein hormone containing 237 amino acids. It acts as an analogue of Luteinizing Hormone (LH). In males, it stimulates the Leydig cells in the testes to produce endogenous testosterone, maintaining testicular size and function during or after exogenous hormone use. In females, it triggers ovulation.',
        researchAreas: ['Hypogonadism', 'Fertility recovery', 'Testicular atrophy prevention', 'TRT adjunct protocols'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5000iu', bacWater: '2 mL', concentration: '2500 iu/mL (250 iu per 0.1 mL)' }], instructions: 'Direct BAC water smoothly against vial wall. Swirl gently.' },
        dosing: [{ phase: 'Maintenance (TRT)', range: '250 – 500 iu', frequency: '2-3x Weekly', duration: 'Ongoing' }, { phase: 'Fertility/Recovery', range: '1000 – 3000 iu', frequency: '2-3x Weekly', duration: '4-8 weeks' }],
        protocol: { loading: 'Not typically loaded.', titration: 'Adjusted based on serum testosterone and fertility markers.', maintenance: 'Commonly injected subcutaneously alongside TRT to maintain endogenous function.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 28-35 days.', lightSensitive: true, notes: 'Loses potency rapidly after 30 days reconstituted.' },
    },
    HMG: {
        fullName: 'Human Menopausal Gonadotropin (hMG/Menotropin)',
        molecularWeight: 'Blend of FSH & LH',
        sequence: 'Extracted glycoprotein mixture',
        mechanism: 'A purified mixture of Follicle-Stimulating Hormone (FSH) and Luteinizing Hormone (LH) in a 1:1 ratio. While hCG only mimics LH (stimulating testosterone), hMG provides FSH, which directly stimulates the Sertoli cells in the testes to initiate and maintain spermatogenesis (sperm production).',
        researchAreas: ['Severe male infertility', 'Spermatogenesis induction', 'Hypogonadotropic hypogonadism'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC) / Provided solvent', volumes: [{ vialSize: '75iu', bacWater: '1 mL', concentration: '75 iu/mL' }], instructions: 'Dissolve in provided sterile solvent or BAC water.' },
        dosing: [{ phase: 'Standard', range: '37.5 – 75 iu', frequency: '2-3x Weekly', duration: '3-6 months' }],
        protocol: { loading: 'Often run concurrently with hCG.', titration: 'Dose adjusted based on semen analysis parameters.', maintenance: 'Spermatogenesis takes ~72-90 days, so protocols must be run for at least 3-4 months to see results.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate and use immediately or within 28 days depending on diluent.', lightSensitive: true, notes: 'Significantly more expensive and targeted than hCG; specifically for fertility.' },
    },
    'KissPeptin-10': {
        fullName: 'Kisspeptin-10',
        molecularWeight: '1302.5 g/mol',
        sequence: 'Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Tyr-NH2',
        mechanism: 'A potent neuromodulator that sits at the very top of the Hypothalamic-Pituitary-Gonadal (HPG) axis. It binds to the GPR54 receptor in the hypothalamus to stimulate the release of Gonadotropin-Releasing Hormone (GnRH), which cascades down to release LH and FSH. Unlike hCG, it stimulates the entire natural axis.',
        researchAreas: ['HPG axis restoration', 'Natural testosterone production', 'Puberty initiation disorders'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Add BAC water carefully. Dissolves well.' },
        dosing: [{ phase: 'Standard', range: '100 – 200 mcg', frequency: 'Daily or EOD', duration: '4-8 weeks' }],
        protocol: { loading: 'Can start at 100 mcg injected subcutaneously.', titration: 'Increase to 200-300 mcg if assessing axis restart capabilities.', maintenance: 'Short half-life requires frequent dosing. Preferred over hCG by some for maintaining entirely natural receptor rhythms.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Avoid continuous high dosing to prevent receptor down-regulation.' },
    },
    'PT-141': {
        fullName: 'Bremelanotide (PT-141)',
        molecularWeight: '1025.2 g/mol',
        sequence: 'Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH',
        mechanism: 'A synthetic peptide analogue of alpha-MSH and a metabolite of Melanotan II. It is an agonist of melanocortin receptors (specifically MC4R) in the central nervous system. Unlike PDE5 inhibitors (Viagra/Cialis) which rely on vascular blood flow mechanisms, PT-141 works directly in the brain to increase sexual desire and arousal in both men and women.',
        researchAreas: ['Hypoactive Sexual Desire Disorder (HSDD)', 'Erectile Dysfunction (Psychogenic)', 'CNS arousal pathways'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '1 mL', concentration: '10 mg/mL (1mg per 0.1 mL)' }], instructions: 'Inject BAC water gently. Swirl.' },
        dosing: [{ phase: 'Standard', range: '1 – 2 mg', frequency: 'As needed', duration: 'Acute' }],
        protocol: { loading: 'Start at 1 mg to assess nausea response.', titration: 'Can increase to 1.75 - 2 mg if tolerated.', maintenance: 'Inject subcutaneously 2-4 hours prior to desired effect. Do not exceed 8 doses per month.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 28 days.', lightSensitive: true, notes: 'Nausea and flushing are common side effects. Works centrally, not vascularly.' },
    },
    'Oxytocin Acetate': {
        fullName: 'Oxytocin',
        molecularWeight: '1007.2 g/mol',
        sequence: 'Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2',
        mechanism: 'A naturally occurring mammalian nonapeptide neurohypophysial hormone. Acts as a neuromodulator in the brain, playing a critical role in social bonding, sexual reproduction, trust, and anxiety reduction. Also stimulates uterine contractions and lactation in females.',
        researchAreas: ['Social anxiety/Autism spectrum', 'Pair bonding/Trust', 'Sexual climax enhancement', 'Cortisol reduction'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC) / Saline', volumes: [{ vialSize: '2mg', bacWater: '2 mL', concentration: '1 mg/mL' }], instructions: 'Often formulated into intranasal sprays or troches for rapid CNS delivery.' },
        dosing: [{ phase: 'Intranasal', range: '10 – 40 iu', frequency: 'As needed', duration: 'Acute' }],
        protocol: { loading: '10-20 iu per dose (usually 1-2 nasal sprays) before social or intimate events.', titration: 'Can dose up to 40 iu.', maintenance: 'Effects last 1-2 hours. Do not use daily to preserve receptor sensitivity.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C.', lightSensitive: true, notes: 'Very fast-acting when applied intranasally.' },
    },
    'Thymosin Alpha-1': {
        fullName: 'Thymosin Alpha-1 (TA1/Zadaxin)',
        molecularWeight: '3108.3 g/mol',
        sequence: '28-amino acid naturally occurring peptide',
        mechanism: 'An endogenous peptide produced by the thymus gland. Functions as a powerful immune modulator. It restores immune system function by augmenting T-cell function (CD4/CD8), stimulating natural killer (NK) cells, and regulating dendritic cells. Extremely effective against chronic viral infections and exhausted immune states.',
        researchAreas: ['Chronic viral infections (Hep B/C, EBV, Lyme)', 'Immunodeficiency', 'Autoimmune modulation', 'Vaccine enhancement'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2 mL', concentration: '2.5 mg/mL' }, { vialSize: '10mg', bacWater: '4 mL', concentration: '2.5 mg/mL' }], instructions: 'Add BAC water. Swirl gently. Very well tolerated peptide.' },
        dosing: [{ phase: 'Standard', range: '1.5 mg', frequency: '2x Weekly', duration: '4-12 weeks' }, { phase: 'Acute/Viral', range: '1.5 mg', frequency: 'Daily', duration: '7-14 days' }],
        protocol: { loading: 'For acute illness: 1.5mg daily subcutaneously until symptoms resolve.', titration: 'No specific titration. Standardized dose per administration.', maintenance: 'For chronic conditions: 1.5mg twice weekly for 12 weeks.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: false, notes: 'Outstanding safety profile. Balances the innate/adaptive immune system rather than just over-stimulating it.' },
    },
    Thymalin: {
        fullName: 'Thymalin',
        molecularWeight: 'Mixture of small peptides',
        sequence: 'Extracted thymus gland peptides',
        mechanism: 'A bioregulator complex extracted from the thymus glands of calves. Similar to Epithalon (for the pineal gland), Thymalin directly repairs and restores the morphology and function of the thymus gland itself. As the thymus shrinks with age (involution), Thymalin reverses this, restoring youthful T-cell production capacities.',
        researchAreas: ['Thymus involution reversal', 'Severe immunosuppression', 'Geronto-immunology'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Dissolves easily. Swirl gently.' },
        dosing: [{ phase: 'Khavinson Protocol', range: '10 mg', frequency: 'Daily', duration: '10 days' }],
        protocol: { loading: '10mg injected daily (or 5mg AM / 5mg PM) for 10 consecutive days.', titration: 'Flat dosing structure.', maintenance: 'Cycle 1-2 times per year to maintain thymus morphology and cellular immunity.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Often paired with Epithalon for comprehensive anti-aging bioregulator protocols.' },
    },
    'Ara-290': {
        fullName: 'Cibinetide (ARA 290)',
        molecularWeight: '1257.4 g/mol',
        sequence: '11-amino acid non-hematopoietic EPO derivative',
        mechanism: 'A peptide engineered from erythropoietin (EPO). It specifically activates the innate repair receptor (IRR) to reduce systemic inflammation and promote tissue protection and repair. Crucially, because it lacks the hematopoietic domains of EPO, it does NOT stimulate red blood cell production (no risk of polycythemia/clotting).',
        researchAreas: ['Small fiber neuropathy', 'Sarcoidosis', 'Systemic lupus', 'Neuropathic pain'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '10mg', bacWater: '2 mL', concentration: '5 mg/mL' }], instructions: 'Add BAC water gently.' },
        dosing: [{ phase: 'Intensive', range: '2 – 4 mg', frequency: 'Daily', duration: '28 days' }],
        protocol: { loading: 'Usually started at 2mg daily injected subcutaneously.', titration: 'Can dose up to 4mg daily for severe neuropathy or inflammatory pain.', maintenance: 'Standard cycles run for 28 days to assess nerve repair efficacy.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Highly specific research focus on neuropathic pain and nerve regeneration.' },
    },
    Melatonin: {
        fullName: 'Melatonin',
        molecularWeight: '232.28 g/mol',
        sequence: 'N-acetyl-5-methoxytryptamine',
        mechanism: 'An endogenous neurohormone produced by the pineal gland that regulates the sleep-wake cycle (circadian rhythm). Also acts as a potent mitochondrial antioxidant and free-radical scavenger, particularly protecting nuclear and mitochondrial DNA.',
        researchAreas: ['Circadian rhythm alignment', 'Insomnia', 'Mitochondrial protection', 'Jet lag'],
        reconstitution: { solvent: 'N/A (Oral/Troche)', volumes: [{ vialSize: '10mg', bacWater: 'N/A', concentration: 'N/A' }], instructions: 'Typically administered orally, sublingually, or via transdermal patches.' },
        dosing: [{ phase: 'Physiological', range: '0.3 – 1 mg', frequency: 'Pre-bed', duration: 'Ongoing' }, { phase: 'Supraphysiological', range: '5 – 10+ mg', frequency: 'Pre-bed', duration: 'Cycles vary' }],
        protocol: { loading: 'Start low (0.3mg) if goal is purely sleep onset.', titration: 'Higher megadoses (10mg+) are researched for antioxidant and anti-cancer protocols rather than just sleep.', maintenance: 'Administer 30-60 minutes before desired sleep time in a dark environment.' },
        storage: { temperature: 'Room Temp', reconstituted: 'N/A', lightSensitive: true, notes: 'Blue light exposure destroys endogenous and exogenous melatonin efficacy.' },
    },
    DSIP: {
        fullName: 'Delta Sleep-Inducing Peptide (DSIP)',
        molecularWeight: '848.8 g/mol',
        sequence: 'Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu',
        mechanism: 'An endogenous neuromodulator peptide primarily found in the hypothalamus. It is known to promote slow-wave (Delta) sleep, alter levels of neurotransmitters, and influence the secretion of various hormones (lowers corticotropin-producing factors). Does not act as a sedative, but normalizes sleep architecture.',
        researchAreas: ['Severe insomnia', 'Pain management', 'Stress/Cortisol reduction', 'Opioid withdrawal'],
        reconstitution: { solvent: 'Bacteriostatic Water (BAC)', volumes: [{ vialSize: '5mg', bacWater: '2.5 mL', concentration: '2 mg/mL' }], instructions: 'Add BAC gently. Swirl slowly.' },
        dosing: [{ phase: 'Standard', range: '100 – 250 mcg', frequency: 'Pre-bed (2-3x/week)', duration: '4 weeks' }],
        protocol: { loading: 'Start very low (100 mcg) injected subcutaneously 1-2 hours before bed.', titration: 'Do not exceed 250 mcg. Paradoxically, higher doses can cause wakefulness instead of sleep.', maintenance: 'Do not use consecutively every night. Best pulsed 2-3 times per week to prevent tolerance.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate at 2–8°C. Use within 21 days.', lightSensitive: true, notes: 'Requires "sleep hygiene" to be effective. Not a chemical knockout agent.' },
    },
    Glutathione: {
        fullName: 'Reduced Glutathione (GSH)',
        molecularWeight: '307.32 g/mol',
        sequence: 'Gamma-L-Glutamyl-L-cysteinylglycine',
        mechanism: 'The body\'s "master antioxidant" found in every cell. It protects cells from free radicals, oxidative stress, and heavy metals. Crucial for hepatic Phase II detoxification pathways, immune system maintenance, and mitochondrial function.',
        researchAreas: ['Hepatic detoxification', 'Skin lightening (melanin inhibition)', 'Neurodegenerative protection', 'Heavy metal chelation'],
        reconstitution: { solvent: 'Sterile Water or Saline (often pre-mixed)', volumes: [{ vialSize: '1500mg', bacWater: 'Varies', concentration: 'High' }], instructions: 'Often comes as a lyophilized powder with a specific diluent ampoule, or pre-mixed.' },
        dosing: [{ phase: 'Maintenance', range: '200 – 400 mg', frequency: '1-2x Weekly', duration: 'Ongoing' }, { phase: 'Intensive/IV', range: '1000 – 1500 mg', frequency: 'Weekly', duration: 'Short courses' }],
        protocol: { loading: 'Dose based on route. Intramuscular (IM) limit is ~200-400mg per injection site due to volume.', titration: 'Intravenous (IV) push allows for much higher gram-level dosing.', maintenance: 'Subcutaneous injection is generally not recommended due to volume issues; IM or IV preferred.' },
        storage: { temperature: '2–8°C', reconstituted: 'Refrigerate. Strong sulfur smell is completely normal.', lightSensitive: true, notes: 'Often stacked with Vitamin C to extend half-life and efficacy.' },
    },
    B12: {
        fullName: 'Vitamin B12 (Cyanocobalamin / Methylcobalamin)',
        molecularWeight: '1355.4 g/mol',
        sequence: 'Cobalt-containing coordination compound',
        mechanism: 'Essential water-soluble vitamin required for red blood cell formation, neurological function, and DNA synthesis. Exists in synthetic (cyano) or active (methyl) forms. Bypasses impaired gut absorption when injected.',
        researchAreas: ['Pernicious anemia', 'Neuropathy', 'Energy metabolism', 'Methylation pathways'],
        reconstitution: { solvent: 'Pre-mixed solution', volumes: [{ vialSize: '10ml bottle', bacWater: 'N/A', concentration: '1000 mcg/mL typical' }], instructions: 'Draw directly from multi-dose vial.' },
        dosing: [{ phase: 'Deficiency', range: '1000 mcg', frequency: 'Weekly to Monthly', duration: 'Ongoing' }],
        protocol: { loading: 'For deficiency, 1000 mcg injected intramuscularly (IM) weekly for 4 weeks.', titration: 'Move to monthly.', maintenance: 'Inject deeply into muscle (deltoid or glute) or subcutaneously.' },
        storage: { temperature: 'Room temp or 2-8°C', reconstituted: 'Keep away from intense light. Liquid is distinctively red.', lightSensitive: true, notes: 'Methylcobalamin is preferred for those with MTHFR mutations.' },
    },
    'L-Carnitine': {
        fullName: 'L-Carnitine (Levocarnitine)',
        molecularWeight: '161.2 g/mol',
        sequence: 'Quaternary ammonium compound',
        mechanism: 'Crucial compound that transports long-chain fatty acids into the mitochondrial matrix so they can be oxidized ("burned") to produce energy (ATP). Injectable bypasses the extremely poor oral bioavailability (~15%) and prevents conversion into TMAO by gut bacteria.',
        researchAreas: ['Lipid metabolism', 'Androgen receptor density', 'Mitochondrial efficiency', 'Exercise performance'],
        reconstitution: { solvent: 'Pre-mixed aqueous solution', volumes: [{ vialSize: '10ml', bacWater: 'N/A', concentration: '200-500 mg/mL typical' }], instructions: 'Draw directly from pre-mixed vial.' },
        dosing: [{ phase: 'Performance', range: '300 – 600 mg', frequency: 'Daily (Pre-workout)', duration: 'Ongoing' }],
        protocol: { loading: 'Inject intramuscularly (IM) 30-60 minutes before cardiovascular or resistance training.', titration: 'Can dose up to 1000mg depending on concentration and muscle tolerance.', maintenance: 'Requires carbohydrate presence (insulin spike) to actively load into the muscle tissue effectively.' },
        storage: { temperature: 'Room Temp', reconstituted: 'Do not freeze. May crystallize if too cold.', lightSensitive: false, notes: 'Injection volume can be high; deep IM injection required.' },
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
