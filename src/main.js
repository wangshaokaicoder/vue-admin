import { createApp } from 'vue'
import App from './App.vue'
import router from './route'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

let app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(ElementPlus)
app.use(router)
app.use(store)

app.mount('#app')
