<template>
    <div>
        <!-- <yd-button size="large" type="primary" @click.native="show1 = true">中间弹出</yd-button> -->
        <yd-popup :close-on-masker="false" v-model="show1" position="center" width="90%">
            <div class="login-wrap">
                <div class="inner-body">
                    <h3 class="header-title">实名认证</h3>
                       <div class="com-authentication">
        <yd-cell-group>
            <yd-cell-item>
                <yd-icon slot="icon" :color="phoneIconColor" name="ucenter-outline" size=".45rem"></yd-icon>
                <yd-input slot="right"
                v-model="phonenum"
                max="14"
                ref="mobileref"
                :show-error-icon="inputIconShow"
                :show-success-icon="inputIconShow"
                placeholder="请输入姓名"
                ></yd-input>
            </yd-cell-item>
             <yd-cell-item>
                <yd-icon slot="icon" :color="phoneIconColor" name="discount" size=".45rem"></yd-icon>
                <yd-input slot="right"
                v-model="idcard"
                max="18"
                ref="mobileref"
                :show-error-icon="inputIconShow"
                :show-success-icon="inputIconShow"
                placeholder="请输入身份证号码"
                ></yd-input>
            </yd-cell-item>
            <yd-cell-item>
                <yd-icon slot="icon" :color="phoneIconColor" name="phone3" size=".45rem"></yd-icon>
                <yd-input slot="right"
                v-model="phonenum"
                max="14"
                ref="mobileref"
                :show-error-icon="inputIconShow"
                :show-success-icon="inputIconShow"
                placeholder="请输入手机号码"
                ></yd-input>
            </yd-cell-item>
        </yd-cell-group>
        <div class="btn">
            <yd-button size="large" @click.native="loginByCode()" type="warning" shape="circle">登陆</yd-button>
        </div>
    </div>
                </div>
            </div>
        </yd-popup>
    </div>
</template>

<script>
export default {
    name: 'authentication',
    data() {
        return {
            show1: true,
            start1: false,
            phonenum: '',
            authentication: '',
            inputIconShow: false,
            phoneIconColor: '#dedede',
            codeIconColor: '#dedede',
            phoneCheckFlag: false,
            codeCheckFlag: false,
            idcard: ''
        }
    },
    created() {},
    watch: {
        phonenum: function(v) {
            const reg = /^(86){0,1}1[3-9]{1}\d{9}$/
            const flag = reg.test(v)
            this.phoneIconColor = !flag ? '#dedede' : '#1a95ea'
            this.phoneCheckFlag = flag
        },
        authentication: function(v) {
            const reg = /\d{6}$/
            const flag = reg.test(v)
            this.codeIconColor = !flag ? '#dedede' : '#1a95ea'
            this.codeCheckFlag = flag
        },
        idcard: function(v) {
            const reg = /\d{6}$/
            const flag = reg.test(v)
            this.codeIconColor = !flag ? '#dedede' : '#1a95ea'
            this.codeCheckFlag = flag
        }
    },
    mounted() {},
    methods: {
        sendCode1() {
            if (!this.phoneCheckFlag) {
                this.$dialog.toast({
                    mes: '请填写正确的手机号',
                    timeout: 1500,
                    icon: 'error'
                });
                return
            }
            this.$dialog.loading.open('发送中...')
            setTimeout(() => {
                this.start1 = true
                this.$dialog.loading.close()

                this.$dialog.toast({
                    mes: '已发送',
                    icon: 'success',
                    timeout: 1500
                })
            }, 1000)
        },
        loginByCode() {
            if (!this.phoneCheckFlag || !this.codeCheckFlag) {
                this.$dialog.toast({
                    mes: '请填写正确的手机号和验证码',
                    timeout: 1500,
                    icon: 'error'
                });
                return
            }
            this.$dialog.loading.open('登陆中...')
            setTimeout(() => {
                this.start1 = true
                this.$dialog.loading.close()

                this.$dialog.toast({
                    mes: '登陆成功',
                    icon: 'success',
                    timeout: 1500
                })
                const res = {
                    code: 0,
                    data: {
                        mobile: this.phonenum
                    }
                }
                this.$emit('authentication', res)
            }, 1000)
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
