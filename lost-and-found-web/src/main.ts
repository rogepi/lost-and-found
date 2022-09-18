import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导入原子化CSS
import 'uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
