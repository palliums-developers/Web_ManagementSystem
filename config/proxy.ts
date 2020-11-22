let vls_back_management_url = 'http://localhost:5000/';
let vls_webserver = 'https://api4.violas.io';

export default {
    '/api/login': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/api/loginLog': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/api/operationLog': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/api/user': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/api/bank': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/api/coin': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/api/captcha': {
        target: vls_back_management_url,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        },
    },
    '/1.0/violas/currency': {
        target: vls_webserver,
        changeOrigin: true,
        pathRewrite: {
            '^/localhost': '',
        }
    }
};
