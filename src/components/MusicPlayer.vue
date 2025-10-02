<template>
	<div class="popup-box sm-w-400">
    <div class="wrapper">
			<div class="close" @pointerdown.stop @click.stop="$emit('close')">
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
import { fetchGoogleSheet } from '../lib/fetchGoogleSheet'

export default {
  data() {
    return { albums: [] };
  },
  async mounted() {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0ZgC1XczWdt5oqg-FIlc3Wck9jZbdIt7VmXONLfaZed0rPBJY_v4kbr5a27XA33Ht1hTP2gfq0VzE/pub?output=tsv&single=true&gid=0';
    const data = await fetchGoogleSheet(url);
    
    this.albums = data.map((cols, i) => ({
      id: `${i}-${cols[0] || ''}-${cols[1] || ''}`,
      date: cols[0] || '',
      album: cols[1] || '',
      mood: cols[2] || ''
    }));
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