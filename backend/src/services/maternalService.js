
function calculateMaternalSchedule(edd, state) {
    const eddDate = new Date(edd);
    const lmp = new Date(eddDate.getTime() - 280 * 24 * 60 * 60 * 1000);
    const DAY = 24 * 60 * 60 * 1000;
    const WEEK = 7 * DAY;
    const now = new Date();

    const vaccines = [];

    // --- VACCINES (Indian Govt UIP + IAP/FOGSI) ---

    // Td-1 at first ANC / ~10 weeks GA (early pregnancy)
    const td1Date = new Date(lmp.getTime() + 10 * WEEK);
    vaccines.push({
        name: 'Td-1 (Tetanus Diphtheria – Dose 1)',
        category: 'vaccine',
        dueDate: td1Date,
        gaWeeks: 10,
        status: td1Date < now ? 'overdue' : 'upcoming',
    });

    // Td-2 at 14 weeks GA (min 4 weeks after Td-1)
    const td2Date = new Date(lmp.getTime() + 14 * WEEK);
    vaccines.push({
        name: 'Td-2 (Tetanus Diphtheria – Dose 2)',
        category: 'vaccine',
        dueDate: td2Date,
        gaWeeks: 14,
        status: td2Date < now ? 'overdue' : 'upcoming',
    });

    // Td Booster at 16 weeks GA (if previously immunised within 3 yrs)
    const tdBoosterDate = new Date(lmp.getTime() + 16 * WEEK);
    vaccines.push({
        name: 'Td Booster (if prev. immunised ≤3 yrs)',
        category: 'vaccine',
        dueDate: tdBoosterDate,
        gaWeeks: 16,
        status: tdBoosterDate < now ? 'overdue' : 'upcoming',
    });

    // Tdap at 26-28 weeks GA (IAP / FOGSI recommendation)
    const tdapDate = new Date(lmp.getTime() + 26 * WEEK);
    vaccines.push({
        name: 'Tdap (Tetanus, Diphtheria, Pertussis)',
        category: 'vaccine',
        dueDate: tdapDate,
        gaWeeks: 26,
        status: tdapDate < now ? 'overdue' : 'upcoming',
    });

    // --- SUPPLEMENTATION (MoHFW Guidelines) ---

    // IFA tablets – start from 1st trimester (~12 weeks)
    const ifaDate = new Date(lmp.getTime() + 12 * WEEK);
    vaccines.push({
        name: 'IFA Tablets (Iron Folic Acid – daily)',
        category: 'supplement',
        dueDate: ifaDate,
        gaWeeks: 12,
        status: ifaDate < now ? 'overdue' : 'upcoming',
    });

    // Calcium supplementation – from 14 weeks GA
    const calciumDate = new Date(lmp.getTime() + 14 * WEEK);
    vaccines.push({
        name: 'Calcium Supplementation (daily from 14 wks)',
        category: 'supplement',
        dueDate: calciumDate,
        gaWeeks: 14,
        status: calciumDate < now ? 'overdue' : 'upcoming',
    });

    // Albendazole – 2nd trimester (after 1st trimester, ~16 wks)
    const albendazoleDate = new Date(lmp.getTime() + 16 * WEEK);
    vaccines.push({
        name: 'Albendazole (Deworming – single dose)',
        category: 'supplement',
        dueDate: albendazoleDate,
        gaWeeks: 16,
        status: albendazoleDate < now ? 'overdue' : 'upcoming',
    });

    // --- ANC CHECKUPS (Govt of India – PMSMA) ---

    // 1st ANC visit – within 12 weeks
    const anc1Date = new Date(lmp.getTime() + 10 * WEEK);
    vaccines.push({
        name: '1st ANC Visit (Registration & Blood Tests)',
        category: 'anc',
        dueDate: anc1Date,
        gaWeeks: 10,
        status: anc1Date < now ? 'overdue' : 'upcoming',
    });

    // 2nd ANC visit – 14-26 weeks (target 20 weeks for anomaly scan)
    const anc2Date = new Date(lmp.getTime() + 20 * WEEK);
    vaccines.push({
        name: '2nd ANC Visit (Anomaly Scan – 18-20 wks)',
        category: 'anc',
        dueDate: anc2Date,
        gaWeeks: 20,
        status: anc2Date < now ? 'overdue' : 'upcoming',
    });

    // 3rd ANC visit – 28-34 weeks
    const anc3Date = new Date(lmp.getTime() + 30 * WEEK);
    vaccines.push({
        name: '3rd ANC Visit (Growth Scan & GDM test)',
        category: 'anc',
        dueDate: anc3Date,
        gaWeeks: 30,
        status: anc3Date < now ? 'overdue' : 'upcoming',
    });

    // 4th ANC visit – 36 weeks to EDD
    const anc4Date = new Date(lmp.getTime() + 36 * WEEK);
    vaccines.push({
        name: '4th ANC Visit (Pre-delivery checkup)',
        category: 'anc',
        dueDate: anc4Date,
        gaWeeks: 36,
        status: anc4Date < now ? 'overdue' : 'upcoming',
    });

    // Sort by gestational age / due date
    vaccines.sort((a, b) => a.dueDate - b.dueDate);

    return { lmp, edd: eddDate, vaccines };
}

/**
 * Generate MRN format: MAT-{STATE_CODE}-{YYYYMMDD}-{SERIAL}
 */
function generateMRN(state, serial) {
    const stateCode = (state || 'XX').substring(0, 2).toUpperCase();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const serialStr = String(serial).padStart(6, '0');
    return `MAT-${stateCode}-${dateStr}-${serialStr}`;
}

/**
 * Generate CRN format: CHD-{STATE_CODE}-{YYYYMMDD}-{SERIAL}
 */
function generateCRN(state, serial) {
    const stateCode = (state || 'XX').substring(0, 2).toUpperCase();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const serialStr = String(serial).padStart(6, '0');
    return `CHD-${stateCode}-${dateStr}-${serialStr}`;
}

module.exports = {
    calculateMaternalSchedule,
    generateMRN,
    generateCRN,
};
