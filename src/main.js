import { createApp } from "vue";
import { createPinia } from "pinia";
import "nprogress/nprogress.css";

import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "@/styles/index.scss";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus, { locale: zhCn });
app.use(router);

app.mount("#app");
