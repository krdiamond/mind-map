import { createApp } from 'vue'
import App from './App.vue'

import './styles/_globals.scss'

import draggable from './directives/draggable.js'

const app = createApp(App)

app.directive('draggable', draggable)

app.mount('#app')