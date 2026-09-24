/* eslint-disable import/no-mutable-exports */
/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
let baseUrl = 'https://blog-api.boycot.top';
let apiUrl = 'https://api.boycot.top/api';
// console.log(import.meta.env.MODE, 'import.meta.env.VITE_API_BASE_URL');
const env = import.meta.env.VITE_MODE || import.meta.env.MODE || 'production';
switch (env) {
    case 'development':
        // baseUrl = '/blog-api'; // url
        // baseUrl = 'http://localhost:3009'; // url
        // baseUrl = 'http://doc.yunzhonghe.com/mock/422'; // mock url
        // apiUrl = 'http://localhost:8090/api';
        // apiUrl = '/boycot-api'; // api url
        break;
    case 'test':
        baseUrl = import.meta.env.VITE_API_BASE_URL; // url
        apiUrl = 'https://api.boycot.top/api'; // api url
        break;
    case 'show':
        baseUrl = import.meta.env.VITE_API_BASE_URL; // url
        apiUrl = 'https://api.boycot.top/api'; // api url
        break;
    case 'production':
        // baseUrl = '/blog-api'; // 生产环境url
        // apiUrl = '/boycot-api'; // api url
        break;
}
export { apiUrl };
export default baseUrl;
