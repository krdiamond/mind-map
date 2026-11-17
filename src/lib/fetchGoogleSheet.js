// All site content lives in one Google Sheet, one tab per section.
const SHEET_ID = '1fz2DY7erTNUq6uJ7qYsz1q5ASV-3QuksmNxsxqAUouo';

// Pass a tab name, e.g. fetchGoogleSheet('One Allbum a Day'). Returns the rows without the header.
// (A full published-TSV link still works, for sections not moved to the new sheet yet.)
export async function fetchGoogleSheet(sheet) {
    if (sheet.startsWith('http')) {
        const txt = await fetch(sheet).then(response => response.text());
        return txt.trim().split(/\r?\n/).map(line => line.split('\t')).slice(1);
    }
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
    const txt = await fetch(url).then(response => response.text());
    return txt.trim().split(/\r?\n/).map(line => line.slice(1, -1).split('","')).slice(1);
}
