<template>
	<div class="popup-box albums">
    <div class="wrapper">
			<div class="close" @pointerdown.stop @click.stop="$emit('close')">
				<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
					<path d="M797.32 985.882 344.772 1438.43l188.561 188.562 452.549-452.549 452.548 452.549 188.562-188.562-452.549-452.548 452.549-452.549-188.562-188.561L985.882 797.32 533.333 344.772 344.772 533.333z"/>
				</svg>
			</div>
			<h2 class="m-12">one album per/day</h2>
			<div class="m-12 album-grid">
				<div v-for="row in albums" :key="row.id" class="album">
					<div class="album__inner">
						<div class="album__face album__front">
							<img v-if="row.image" :src="row.image" :alt="`${row.album} by ${row.band}`" loading="lazy" />
							<span class="album__date-tag">{{ row.date }}</span>
						</div>
					</div>
				</div>
			</div>
    </div>
	</div>
</template>

<script>
import { fetchGoogleSheet } from '../../lib/fetchGoogleSheet'

export default {
  name: 'Albums',
  data() {
    return {
      sheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0ZgC1XczWdt5oqg-FIlc3Wck9jZbdIt7VmXONLfaZed0rPBJY_v4kbr5a27XA33Ht1hTP2gfq0VzE/pub',
      albums: [],
    };
  },
  async mounted() {
    const [data, images] = await Promise.all([
      fetchGoogleSheet(`${this.sheet}?output=tsv&single=true&gid=0`),
      this.fetchSheetImages(),
    ]);
    this.albums = data.map((cols, i) => ({
      id: i,
      date: (cols[0] || '').replace(/\//g, '.').replace(/\.\d{2}(\d{2})$/, '.$1'),
      band: cols[1] || '',
      album: cols[2] || '',
      image: images[i + 1] || '',
      rating: cols[4] || '',
    }));
  },
  methods: {
    // The published text (TSV) leaves images out, so the images are read from the
    // sheet's Excel (.xlsx) download, which is a zip file. Returns { rowNumber: imageUrl }.
    async fetchSheetImages() {
      const buf = new Uint8Array(await fetch(`${this.sheet}?output=xlsx`).then(r => r.arrayBuffer()));
      const view = new DataView(buf.buffer);

      // List the files in the zip.
      let end = buf.length - 22;
      while (view.getUint32(end, true) !== 0x06054b50) end--;
      const files = {};
      for (let i = 0, p = view.getUint32(end + 16, true); i < view.getUint16(end + 10, true); i++) {
        const nameLength = view.getUint16(p + 28, true);
        const name = new TextDecoder().decode(buf.subarray(p + 46, p + 46 + nameLength));
        files[name] = { method: view.getUint16(p + 10, true), size: view.getUint32(p + 20, true), offset: view.getUint32(p + 42, true) };
        p += 46 + nameLength + view.getUint16(p + 30, true) + view.getUint16(p + 32, true);
      }
      const read = async (name) => {
        const f = files[name];
        const start = f.offset + 30 + view.getUint16(f.offset + 26, true) + view.getUint16(f.offset + 28, true);
        const blob = new Blob([buf.subarray(start, start + f.size)]);
        return f.method === 0 ? blob : new Response(blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))).blob();
      };

      // Each picture in the first sheet's drawing is anchored to a row.
      const drawing = await (await read('xl/drawings/drawing1.xml')).text();
      const rels = await (await read('xl/drawings/_rels/drawing1.xml.rels')).text();
      const images = {};
      for (const [, row, id] of drawing.matchAll(/<xdr:row>(\d+)<\/xdr:row>[\s\S]*?r:embed="([^"]+)"/g)) {
        const target = rels.match(new RegExp(`Id="${id}"[^>]*Target="\\.\\./([^"]+)"`))[1];
        images[row] = URL.createObjectURL(new Blob([await read(`xl/${target}`)], { type: 'image/png' }));
      }
      return images;
    },
  },
};
</script>


<style scoped>

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.album {
  aspect-ratio: 1 / 1;
  outline: none;
}

.album__inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.album__face {
  position: absolute;
  inset: 0;
  border: 1px solid black;
  overflow: hidden;
}

.album__front {
  background: #f2f2f2;
}

.album__front img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album__date-tag {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  padding: 2px 6px;
  background: #2ecc71;
  color: black;
  border: 1px solid black;
  font-size: 12px;
  line-height: 1;
}

</style>
