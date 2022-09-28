import axios from 'axios'
import store from '../store'
import router from '@/route'

axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'


axios.interceptors.request.use(
  function (config) {


      return config;
  },
  function (error) {
      return Promise.reject(error);
  }
);



axios.interceptors.response.use(res => {
  console.log(res);
  console.log("===axios.interceptors.response");
  if (typeof res.data !== 'object') {
    return Promise.reject(res)
  }
  //未登录
  if (res.data.code === 4001) {
       router.push({ path: '/login' })
       return Promise.reject(res)
  }
  if(res.data.code === 2001){
    console.log(store);
      let token = res.data.token;
      store.dispatch('setToken',token);
    return res.data;
  }

  let newToken = res.headers.token;
  if(newToken && newToken != ""){
     localStorage.setItem('token',newToken);
  }
//   if (res.data.resultCode != 200) {
//     if (res.data.message) Toast.fail(res.data.message)
//     if (res.data.resultCode == 416) {
//       router.push({ path: '/login' })
//     }
//     if (res.data.data && window.location.hash == '#/login') {
//       setLocal('token', res.data.data)
//       axios.defaults.headers['token'] = res.data.data
//     }
//     return Promise.reject(res.data)
//   }

  return res.data
})


axios.prototype.getWidthObjParam = function(url,paramObj){
    return axios.get(url,new URLSearchParams(paramObj));
}

axios.postJson = (url,data)=>{
    return axios({
      method: "post",
      url: url,
      data: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      }
  })
}


export default axios