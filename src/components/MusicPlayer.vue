<template>
	<div>
    <div class="wrapper">
			<div class="close" @click="$emit('close')">
				<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
					<path d="M797.32 985.882 344.772 1438.43l188.561 188.562 452.549-452.549 452.548 452.549 188.562-188.562-452.549-452.548 452.549-452.549-188.562-188.561L985.882 797.32 533.333 344.772 344.772 533.333z"/>
				</svg>
			</div>
			<h2 class="m-12">one unique album per/day</h2>
			<div class="m-12">
				<p class="mb-6">September 2025</p>
				<table>
					<tbody>
						<tr v-for="row in albums" :key="row.id">
							<td>{{ row.date }}</td>
							<td>{{ row.album }}</td>
							<td><span class="emoji">{{ row.mood }}</span></td>
						</tr>
					</tbody>
				</table>
			</div>
    </div>
	</div>
</template>


<script>
export default {
  data() {
    return { albums: [], loading: false, loadError: null };
  },
  async mounted() {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0ZgC1XczWdt5oqg-FIlc3Wck9jZbdIt7VmXONLfaZed0rPBJY_v4kbr5a27XA33Ht1hTP2gfq0VzE/pub?gid=0&single=true&output=tsv';
    this.loading = true;
    try {
      const txt = await fetch(url, { cache: 'no-store' }).then(r => r.text());
      // Parse TSV safely (no CSV quoting headaches)
      const rows = txt.trim().split(/\r?\n/).map(line => line.split('\t'));
      // Expect columns: Date | Album | Mood
      this.albums = rows.map((cols, i) => ({
        id: i + '-' + cols[0] + '-' + cols[1],
        date: cols[0] || '',
        album: cols[1] || '',
        mood: cols[2] || ''
      }));
    } catch (err) {
      console.error(err);
      this.loadError = 'Failed to load albums from Google Sheets.';
    } finally {
      this.loading = false;
    }
  }
};
</script>




<style scoped>

table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
  }

  th, td {
    border: 1px solid black;
    padding: 0 6px;
    text-align: left;
  }

  td:last-child {
  padding: 0 3px;
}

</style>