<template>
    <div class="main">
        <div class="loign-form">
                <div class="title">
                    <h4>{{loginData.loginType === '0' ? '用户名密码' : '手机号'}}登录</h4>
                </div>
                <div class="content">
                    <el-form :model="loginData" :rules="rules" ref="loginForm" label-width="100px" class="">
                    <template v-if="loginData.loginType === '0'">
                        <el-form-item label="用户名" prop="username">
                        <el-input auto-complete="false"  placeholder="请输入用户名" prefix-icon="User" v-model="loginData.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input auto-complete="false"  placeholder="请输入密码" prefix-icon="Lock" v-model="loginData.password" show-password></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="loginData.loginType === '1'">
                        <el-form-item label="手机号码" prop="telPhone" :rule="telphone">
                        <el-input auto-complete="false"  maxlength="11"  placeholder="请输入手机号" prefix-icon="Cellphone" v-model="loginData.telPhone"></el-input>
                        </el-form-item>
                    </template>
                    
                      <el-form-item label="验证码" prop="authCode" :rule="authCode">
                        <el-col :span="10">
                            <el-input auto-complete="false" maxlength="4"   minlength="4"  placeholder="请输入验证码"  v-model="loginData.authCode" ></el-input>
                        </el-col>
                        <el-col :span="10">
                            <div class="codeContent" >
                                   <img class="captcha" :src="captcha.imageData" />     
                            </div>
                        </el-col>
                        <el-col :span="1">
                            <el-button type="primary"  circle @click="flushCode()">
                              <el-icon><Refresh /></el-icon>
                            </el-button>     
                        </el-col>
                    </el-form-item>

                    <!---发送验证码-->
                    <template v-if="loginData.loginType === '1'">
                        <el-form-item label="手机验证码" prop="phoneCode">
                            <el-col :span="10">
                                <el-input auto-complete="false"  placeholder="请输入手机验证码"  v-model="loginData.phoneCode"></el-input>
                          </el-col>
                          <el-col :span="1">
                            <el-button type="primary"  @click="sendPhoneCode">发送验证码</el-button>     
                        </el-col>
                        </el-form-item>
                    </template>

                    <el-form-item>
                        <el-button type="primary" @click="submitLogin()">登录</el-button>
                       
                        <el-button @click="resetForm('loginForm')">重置</el-button>
                    </el-form-item>

                    <el-form-item class="changeTypeItem">
                        <el-button size="small" type="success" @click="loginTypeChange()">{{loginData.loginType === '1' ? '用户名密码' : '手机验证码'}}登录</el-button>
                    </el-form-item>
                    </el-form>
                </div>
        </div>
    </div>   
</template>


<script>
import VueAxios from 'vue-axios';
import {
    getLoginCaptcha,
    sendTellPhoneCode,
    formLogin 
} from '@/apis/login/login.js'
import {ref,onMounted ,reactive,getCurrentInstance } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
export default {

    setup(props,ctx){
        let loginData = reactive({
            username:'1',
            password:'',
            telPhone:'',
            authCode:'',
            randomCode:'',
            loginType:'0',
            phoneCode:''   
        });

        let captcha = reactive({
            imageData: '',
            randomCode: ''
        });



        onMounted(() => {
            flushCode();
        })


        function telPhoneLogin(){
            console.log("==");
        }

        //校验
        const rules = reactive({
            username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 15, message: '请输入2到15个字符', trigger: 'blur' }
                    ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            telPhone: [
                { required: true, message: '请输入手机号', trigger: 'blur' }
            ],
            authCode: [
                {
                required: true,
                message: '请输入图形验证码',
                trigger: 'change',
                },
            ],
            phoneCode: [
                { required: true, message: '请输入手机号', trigger: 'blur' }
            ]
        })

        



        function flushCode(){
            getLoginCaptcha().then((response)=>{
                captcha.imageData = response.data.imageData;
                captcha.randomCode = response.data.randomCode;
                loginData.authCode = '';
            });
        }

        function loginTypeChange(){
            loginData.loginType = loginData.loginType === '0' ? '1' : '0';
            loginData.authCode = "";
            loginData.username = "";
            loginData.password = "";
            flushCode();
        }

        let instance = getCurrentInstance()
        function sendPhoneCode(){
          //手机验证码不校验
          rules.phoneCode[0].required = false;

         let ret = instance.refs.loginForm.validate((valid, fields) => {
            if (valid) {
                console.log('submit!')
            } else {
                console.log('error submit!', fields)
            }
        });

        ret.then((r)=>{
            if(r){
                //校验通过
                let send = {};
                send.telPhone = loginData.telPhone;
                send.authCode = loginData.authCode;
                send.randomCode = captcha.randomCode;
                sendTellPhoneCode(send).then((res)=>{
                    if(res.code === 2000){
                        //成功
                    }else{
                        //失败
                    }

                })
            }
            }).catch(()=>{
                console.log("22",ret);
            })
        }

        //提交登录
        const submitLogin = ()=>{
            rules.phoneCode[0].required = true;
            //校验参数
            instance.refs.loginForm.validate().then((ret)=>{
                if(ret){
                    var data = {...loginData};
                    data.authCode = data.phoneCode
                    delete data.phoneCode;
                    formLogin(data).then((r)=>{
                        if(r.code === 4008){
                            console.log(r.token);
                        }
                    });
                }
            })
        }

        return {
                loginData,
                captcha,
                telPhoneLogin,
                flushCode,
                loginTypeChange,
                sendPhoneCode,
                rules,
                submitLogin
                };
    }
}
</script>

<style lang="less" scoped>
    body {
        display: block;
        margin: unset;
    }   

    div.main{
        background-color: gray;
         height: 100vh;
        width: 100vw;
        display: flex;

        div.loign-form{
            div.title{
                height: 30px;
                text-align: center;
                padding-bottom: 50px;
            }
            background-color: white;
            height: 400px;
            width: 500px;
            margin: auto auto;
            border-radius: 6px;
            padding: 20px;

            .codeContent{
                margin-left: 10px;;
                img{
                    width:80px;
                    height: 28px;
                }
            }
            .changeTypeItem{
                float:right;
                display: block;
                margin-top: 50px;
            }
        }
    }
</style>
