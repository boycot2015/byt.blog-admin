import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';
import baseUrl from './baseUrl';

export interface HttpResponse<T = unknown> {
    message: string;
    code: number;
    data: T;
    success: boolean;
}
let hasModal = false;
if (import.meta.env.VITE_API_BASE_URL) {
    // axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
    // axios.defaults.baseURL = baseUrl;
}

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // let each request carry token
        // this example using the JWT token
        // Authorization is a custom headers key
        // please modify it according to the actual situation
        if (!config.url?.includes('/boycot-api')) {
            config.url = baseUrl + config.url;
        }
        const token = getToken();
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        // do something
        return Promise.reject(error);
    }
);
// add response interceptors
axios.interceptors.response.use(
    (response: AxiosResponse<HttpResponse>) => {
        const res = response.data;
        // if the custom code is not 20000, it is judged as an error.
        if (!res.success) {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (
                [2, 50012, 50014].includes(res.code) &&
                response.config.url !== '/api/user/info'
            ) {
                if (hasModal)
                    return Promise.reject(new Error(res.message || 'Error'));
                Modal.error({
                    title: '温馨提示',
                    content: '登录失效，请重新登录',
                    okText: '重新登录',
                    maskClosable: false,
                    async onOk() {
                        const userStore = useUserStore();
                        await userStore.logoutCallBack();
                        window.location.reload();
                        hasModal = false;
                    },
                });
                hasModal = true;
            } else {
                Message.error(res.message || 'Error');
            }
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res;
    },
    (error: any) => {
        const msg = error.response?.data?.message || 'Request Error';
        if (msg === 'Unauthorized') {
            Modal.error({
                title: '温馨提示',
                content: '登录失效，请重新登录',
                okText: '重新登录',
                maskClosable: false,
                async onOk() {
                    const userStore = useUserStore();
                    await userStore.logoutCallBack();
                    window.location.reload();
                    hasModal = false;
                },
            });
        } else {
            Message.error(msg);
        }
        return Promise.reject(error);
    }
);
