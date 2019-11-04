<template>
    <div class="com-get-phone">
        <yd-button  size="large" type="warning" shape="circle" :loading="loading" :loading-txt="loadingTxt">
            <div class="text">本机号码一键登录</div>
            <div class="phone-num">
                {{phone}}
            </div>
        </yd-button>
    </div>
</template>

<script>
import YDRZ from '@/common/YDRZ.js'
import webMMAPi from 'api/index'
export default {
    name: 'getPhone',
    data() {
        return {
            loadingTxt: '本机号码取号中',
            loading: true,
            phone: ''
        }
    },
    created() {},
    mounted() {
        // this.getPhone().then(res => {
        //     this.phone = res
        //     this.loading = false
        // })
        this.getPhoneByToken().then(mobile => {
            this.phone = mobile
            this.$emit('getPhone', mobile)
        }).finally(function() {
            this.loading = false
        });
    },
    methods: {
        async getPhone() {
            try {
                return new Promise(resolve => {
                    let phone = null
                    setTimeout(() => {
                        phone = '134****6550'
                        resolve(phone)
                    }, 3000)
                })
            } catch (err) {
                this.$dialog.toast({
                    mes: '这里是home页面状态码不为200的error提示',
                    timeout: 1500,
                    icon: 'error'
                });
                console.log('err', err)
            }
        },
        async ydrzgetTokenParams() {
            const preSign = YDRZ.getSign('300011879751', '1.2');
            const RSAstartTime = Date.parse(new Date()); // 获取当前时间
            const params = {
                sign: preSign
            }
            return new Promise(resolve => {
                webMMAPi
                    .ydrzgetTokenParams(params)
                    .then((data) => {
                        if (data != null) {
                            var datas = JSON.stringify(data);
                            var jsonObj = eval('(' + datas + ')');
                            var RSAendTime = Date.parse(new Date()); // 获取当前时间

                            var RSATime = parseInt(RSAendTime) - parseInt(RSAstartTime);
                            console.log('RSATime ' + RSATime);
                            if (jsonObj.resultCode === '0') {
                                let sign = jsonObj.sign;
                                var TokenstartTime = Date.parse(new Date()); // 获取当前时间

                                YDRZ.getTokenInfo({
                                    data: {
                                    // 请求的参数
                                        version: '1.2',
                                        // 接口版本号 （必填）
                                        appId: '300011879751',
                                        // 应用Id （必填）
                                        sign: sign,
                                        // RSA加密后的sign（必填）
                                        openType: '1',
                                        // 移动取号接口填写1,三网取号接口填写0 （必填，联调时必须填写为1）
                                        expandParams: '',
                                        // 扩展参数  格式：参数名=值  多个时使用 | 分割（选填，联调环境只能模拟取号，联调时需填写phoneNum=188185*****手机号可以随便填写，生产可不填）
                                        isTest: '' // 是否启用测试线地址（传0时为启用不为0或者不传时为不启用）

                                    },
                                    success: function success(res) {
                                    // 成功回调
                                        var TokenendTime = Date.parse(new Date()); // 获取当前时间

                                        var tokenTime = parseInt(TokenendTime) - parseInt(TokenstartTime);
                                        console.log('tokenTime ' + tokenTime);
                                        var resCode = '000000';

                                        if (resCode === res.code) {
                                            var tokenJson = {};
                                            tokenJson.token = res.token;
                                            tokenJson.userInformation = res.userInformation;
                                            tokenJson.tokenTime = tokenTime;
                                            tokenJson.RSATime = RSATime;
                                            resolve(tokenJson)
                                        }
                                    },
                                    error: function error(res) { // YDRZ error end
                                        console.log(res);
                                    }
                                });
                            }
                        }
                    }, (error) => {
                        console.log(error)
                    })
            }, reject => {
                reject(false)
            })
        },
        async getPhoneByToken() {
            return new Promise(resove => {
                this.ydrzgetTokenParams()
                    .then((tokenData) => {
                        webMMAPi.ydrzGetPhoneByToken(tokenData)
                            .then((data) => {
                                const datas = JSON.stringify(data);
                                const jsonObj = eval('(' + datas + ')');
                                let mobile = jsonObj.data.msisdn
                                // this.phone = mobile
                                // console.log('mobile=', mobile)
                                // this.$emit('getPhone', mobile)
                                resove(mobile)
                            }, (error) => {
                                console.log(error)
                            })
                    })
            }, reject => {
                reject(false)
            })
        }
    }
}
</script>

<style scoped lang="scss">
.hello {
  font-size: 32px;
}
</style>
