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
					<img v-if="row.image" :src="row.image" :alt="`${row.album} by ${row.band}`" loading="lazy" />
					<span class="album__date-tag">{{ row.date }}</span>
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
      albums: [],
    };
  },
  async mounted() {
    const data = await fetchGoogleSheet('One Allbum a Day');
    this.albums = data.filter(cols => cols[0]).map((cols, i) => {
      const imageId = cols[3]?.match(/[-\w]{25,}/)?.[0]; // file id from the Drive share link
      return {
        id: i,
        date: cols[0].replace(/\//g, '.').replace(/\.\d{2}(\d{2})$/, '.$1'), // 01/02/2027 -> 01.02.27
        band: cols[1],
        album: cols[2],
        image: imageId ? `https://drive.google.com/thumbnail?id=${imageId}&sz=w240` : '',
        rating: cols[5],
      };
    });
  }
};
</script>


<style scoped>

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.album {
  position: relative;
  aspect-ratio: 1 / 1;
  border: 1px solid black;
  overflow: hidden;
  background: #f2f2f2;
}

.album img {
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
