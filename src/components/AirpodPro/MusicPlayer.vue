<template>
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
</style>

<!-- <template>
	<div class="popup-box albums">
    <div class="wrapper">
			<div class="close" @pointerdown.stop @click.stop="$emit('close')">
				<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
					<path d="M797.32 985.882 344.772 1438.43l188.561 188.562 452.549-452.549 452.548 452.549 188.562-188.562-452.549-452.548 452.549-452.549-188.562-188.561L985.882 797.32 533.333 344.772 344.772 533.333z"/>
				</svg>
			</div>
			<h2 class="m-12">one unlistened unique album per/day</h2>
			<div class="m-12">
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
import { fetchGoogleSheet } from '../../lib/fetchGoogleSheet'

export default {
  name: 'Albums',
  data() {
    return { 
      albums: [],
    };
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

</style> -->