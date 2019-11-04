<template>
    <div class="com-get-phone">
        <yd-button size="large" type="warning" shape="circle" :loading="loading" :loading-txt="loadingTxt">
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
import { setTimeout } from 'timers';
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
        const that = this
        setTimeout(() => {
            this.getPhoneByToken()
                .then(mobile => {
                    that.phone = mobile
                    that.$emit('getPhone', mobile)
                })
                .catch(function() {
                    that.$dialog.toast({
                        mes: '取号失败',
                        timeout: 1500,
                        icon: 'error'
                    })
                    that.$emit('getPhone', false)
                })
                .finally(function() {
                    that.loading = false
                })
        }, 6000) // 6s网络异常测试 需手动关闭网络谷歌浏览器
    },
    methods: {
        async ydrzgetTokenParams() {
            const preSign = YDRZ.getSign('300011879751', '1.2')
            const RSAstartTime = Date.parse(new Date()) // 获取当前时间
            const params = {
                sign: preSign
            }
            return new Promise((resolve, reject) => {
                webMMAPi.ydrzgetTokenParams(params).then(data => {
                    if (data != null) {
                        // var datas = JSON.stringify(data);
                        // var jsonObj = eval('(' + datas + ')');
                        var jsonObj = data
                        var RSAendTime = Date.parse(new Date()) // 获取当前时间

                        var RSATime = parseInt(RSAendTime) - parseInt(RSAstartTime)
                        console.log('RSATime ' + RSATime)
                        if (jsonObj.resultCode === 0) {
                            let sign = jsonObj.sign
                            var TokenstartTime = Date.parse(new Date()) // 获取当前时间

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
                                    var TokenendTime = Date.parse(new Date()) // 获取当前时间

                                    var tokenTime =
                    parseInt(TokenendTime) - parseInt(TokenstartTime)
                                    console.log('tokenTime ' + tokenTime)
                                    var resCode = '000000'

                                    if (resCode === res.code) {
                                        var tokenJson = {}
                                        tokenJson.token = res.token
                                        tokenJson.userInformation = res.userInformation
                                        tokenJson.tokenTime = tokenTime
                                        tokenJson.RSATime = RSATime
                                        resolve(tokenJson)
                                    }
                                },
                                error: function error(res) {
                                    // YDRZ error end
                                    console.log(res)
                                    reject(new Error(res))
                                }
                            })
                        }
                    }
                }).catch(() => {
                    console.log('net error')
                    reject(new Error('false'))
                })
            })
        },
        async getPhoneByToken() {
            return new Promise((resolve, reject) => {
                this.ydrzgetTokenParams()
                    .then(tokenData => {
                        webMMAPi.ydrzGetPhoneByToken(tokenData).then(data => {
                            // const datas = JSON.stringify(data);
                            // const jsonObj = eval('(' + datas + ')');
                            const jsonObj = data
                            let mobile = jsonObj.data.msisdn
                            // this.phone = mobile
                            // console.log('mobile=', mobile)
                            // this.$emit('getPhone', mobile)
                            resolve(mobile)
                        })
                    })
                    .catch(() => {
                        reject(new Error('false'))
                    })
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
