import axios from '@/util/axios.js'
import qs from 'qs';

/**
 * 获取登录验证码
 */
export function getLoginCaptcha(){
    return axios.get("/index/captcha");
}


export function sendTellPhoneCode(data){
    return axios.postJson("/index/sendPhoneCode",data);
}


export function formLogin(data){
    return axios.postJson("/login",data);
}