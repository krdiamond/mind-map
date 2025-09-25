export async function fetchGoogleSheet(url) {
    const txt = await fetch(url).then(response => response.text());
    const rows = txt.trim().split(/\r?\n/).map(line => line.split('\t'));
    return rows.slice(1);
}