
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 432, hash: '787a316a15bc6649df2d47036b21529fd2f5d6a94be9304e3a7d04b68c8c03b2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 945, hash: 'b32996da3dba1016ab75dec71dd76e25ea736188307bf8f0121f5b7af6cbc40e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 10012, hash: '2995eef94d8fd57e6a88a08432997508bd261d7a89bea56cd49badc065db1b8c', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 10471, hash: '534474320703040ec94c903af5d515e5bff217b2c01b851905b87747eec32a39', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'index.html': {size: 14538, hash: 'cc939402fc9ea27f854cbec5beeb595fc24dca998059b92e10dd31ed87304138', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
