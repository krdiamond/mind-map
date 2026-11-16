<!-- <template>
  <div class="player">
    <h1>My Playlist</h1>

    <div class="now-playing">
      Now playing: {# currentSong.title #}
    </div>

    <audio
      ref="audio"
      :src="currentSong.src"
      @ended="nextSong"
    ></audio>

    <div class="controls">
      <button @click="prevSong">Prev</button>
      <button @click="togglePlay">
        {# isPlaying ? 'Pause' : 'Play' #}
      </button>
      <button @click="nextSong">Next</button>
    </div>

    <ul class="playlist">
      <li
        v-for="(song, index) in songs"
        :key="index"
        :class="{ active: index === currentSongIndex }"
        @click="selectSong(index)"
      >
        {# song.title #}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SimpleAudioPlayer',
  data() {
    return {
      currentSongIndex: 0,
      isPlaying: false,
      songs: [
        {
          title: 'Song One',
          src: '/audio/song-one.mp3'
        },
        {
          title: 'Song Two',
          src: '/audio/song-two.mp3'
        },
        {
          title: 'Song Three',
          src: '/audio/song-three.mp3'
        }
      ]
    }
  },
  computed: {
    currentSong() {
      return this.songs[this.currentSongIndex]
    }
  },
  methods: {
    togglePlay() {
      const audio = this.$refs.audio

      if (!audio) return

      if (audio.paused) {
        audio.play()
        this.isPlaying = true
      } else {
        audio.pause()
        this.isPlaying = false
      }
    },
    selectSong(index) {
      this.currentSongIndex = index
      this.playCurrentSong()
    },
    nextSong() {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length
      this.playCurrentSong()
    },
    prevSong() {
      this.currentSongIndex =
        (this.currentSongIndex - 1 + this.songs.length) % this.songs.length
      this.playCurrentSong()
    },
    playCurrentSong() {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        if (!audio) return

        audio.load()
        audio.play()
        this.isPlaying = true
      })
    }
  }
}
</script>

<style scoped>
.player {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  margin-top: 0;
}

.now-playing {
  margin-bottom: 16px;
  font-weight: bold;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 14px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background: #f0f0f0;
}

.playlist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist li {
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.playlist li:hover {
  background: #f5f5f5;
}

.playlist li.active {
  background: #e8f0ff;
  font-weight: bold;
}
</style> -->

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

const SHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0ZgC1XczWdt5oqg-FIlc3Wck9jZbdIt7VmXONLfaZed0rPBJY_v4kbr5a27XA33Ht1hTP2gfq0VzE/pub';

// The published text (TSV) leaves images out, so the images are read from the
// sheet's Excel (.xlsx) download, which is a zip file. Returns { rowNumber: imageUrl }.
async function fetchSheetImages() {
  const buf = new Uint8Array(await fetch(`${SHEET}?output=xlsx`).then(r => r.arrayBuffer()));
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
}

export default {
  name: 'Albums',
  data() {
    return {
      albums: [],
    };
  },
  async mounted() {
    const [data, images] = await Promise.all([fetchGoogleSheet(`${SHEET}?output=tsv&single=true&gid=0`), fetchSheetImages()]);
    this.albums = data.map((cols, i) => ({
      id: i,
      date: (cols[0] || '').replace(/\//g, '.').replace(/\.\d{2}(\d{2})$/, '.$1'),
      band: cols[1] || '',
      album: cols[2] || '',
      image: images[i + 1] || '',
      rating: cols[4] || '',
    }));
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
