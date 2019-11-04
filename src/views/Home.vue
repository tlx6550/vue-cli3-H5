<template>
    <div>
        <!-- <yd-button size="large" type="primary" @click.native="show1 = true">中间弹出</yd-button> -->
        <yd-popup :close-on-masker="false" v-model="show1" position="center" width="90%">
            <div class="login-wrap">
                <div class="inner-body">
                    <h3 class="header-title">账号登录</h3>
                    <div v-show="goback" class="goback">
                        <yd-icon size="0.3rem" @click.native="showsmszoneHandler"  name="share2"></yd-icon>
                    </div>
                    <div v-show="showphonezone" class="phonezone">
                        <div class="get-phone-by-4g">
                            <!-- <yd-button @click.native="loginImit()" size="large" type="warning" shape="circle" :loading="loading" :loading-txt="loadingTxt">
                                <div  class="text">本机号码一键登录</div>
                                <div class="phone-num">
                                    {{phone}}
                                </div>
                            </yd-button> -->
                            <getPhone @getPhone="getPhoneHanddler"></getPhone>
                        </div>
                        <div class="other-login-way">
                            <div class="title">其它登录方式</div>
                        </div>
                        <div class="way-box">
                            <yd-button type="warning" shape="circle" @click.native="showsmszoneHandler()">其它号码</yd-button>
                        </div>
                    </div>
                    <div v-show="showsmszone" class="smscode-wrap">
                        <smscode @smscode="getSmscode"></smscode>
                    </div>
                </div>
            </div>
        </yd-popup>
    </div>
</template>

<script>
// @ is an alias to /src
import {
    mapActions
} from 'vuex';
import smscode from '@/components/smscode.vue'
import getPhone from '@/components/getPhone.vue'
import webMMAPi from 'api/index'
import { Toast } from 'mint-ui'
import { get, post } from '@/axios/http.js'
export default {
    name: 'home',
    components: {
        smscode,
        getPhone
    },
    data() {
        return {
            username: '9999',
            password: '',
            show1: true,
            loadingTxt: '本机号码取号中',
            loading: true,
            phone: '',
            showphonezone: true,
            showsmszone: false,
            goback: false
        }
    },
    async created() {
    },
    mounted() {
    },
    methods: {
        ...mapActions('login', ['login']),
        showsmszoneHandler() {
            this.goback = !this.goback
            this.showphonezone = !this.showphonezone
            this.showsmszone = !this.showsmszone
        },
        getSmscode(res) {
            console.log(res)
            this.login({
                mobile: res.mobile,
                $router: this.$router,
                $route: this.$route
            });
        },
        getPhoneHanddler(mobile) {
            console.log('取号结果=', mobile)
            // this.$dialog.toast({
            //     mes: '取号结果=' + mobile,
            //     timeout: 1500
            // });
        },
        loginImit() {
            const res = {
                mobile: this.phone,
                $router: this.$router,
                $route: this.$route
            }
            this.login(res);
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.demo-img {
  height: 1rem;
  width: 0.5rem;
}
.login-wrap {
  opacity: 0.95;
  background: #ffffff;
  border-radius: 53px;
  .inner-body {
    position: relative;
    padding: 50px;
    .goback{
        position: absolute;
        z-index: 99;
       top: 0.2rem;
    }
  }
  .other-login-way {
    margin-top: 80px;
  }
  .way-box {
    margin-top: 20px;
  }
}
</style>
