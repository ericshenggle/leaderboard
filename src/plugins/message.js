// src/plugins/message.js

import { ElMessage } from 'element-plus';

const messagePlugin = {
    install(app) {
        app.config.globalProperties.$message = ElMessage;
    }
};

export default messagePlugin;
