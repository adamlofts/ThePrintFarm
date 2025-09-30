// vite.config.js
import * as path from "node:path";

export default {
    resolve: {
        alias: {
            '@api': path.resolve(__dirname, 'api'),
            '@components': path.resolve(__dirname, 'components'),
            '@hooks': path.resolve(__dirname, 'hooks'),
        },
    },
    base: '/',
}
