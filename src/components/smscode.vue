<template>
    <div class="com-smscode">
        <yd-cell-group>
            <yd-cell-item>
                <yd-icon slot="icon" :color="phoneIconColor" name="phone3" size=".45rem"></yd-icon>
                <yd-input slot="right"
                v-model="phonenum"
                regex="^(86){0,1}1[3-9]{1}\d{9}$"
                max="11"
                ref="mobileref"
                :show-error-icon="inputIconShow"
                :show-success-icon="inputIconShow"
                placeholder="请输入手机号码"
                ></yd-input>
            </yd-cell-item>
            <yd-cell-item>
                <yd-icon slot="icon" :color="codeIconColor" name="shield" size=".45rem"></yd-icon>
                <yd-input slot="right"
                v-model="smscode"
                 ref="smscoderef"
                regex="^\d{6}$"
                max="6"
                :show-error-icon="inputIconShow"
                :show-success-icon="inputIconShow"
                placeholder="请输入验证码"
                ></yd-input>
               <!-- ↓↓关键代码是这里↓↓ -->
                <yd-sendcode slot="right" v-model="start1" @click.native="sendCode1" type="hollow"></yd-sendcode>
                <!-- ↑↑关键代码是这里↑↑ -->

            </yd-cell-item>
        </yd-cell-group>
        <div class="btn">
            <yd-button size="large" @click.native="loginByCode()" type="warning" shape="circle">登陆</yd-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'smscode',
    data() {
        return {
            start1: false,
            phonenum: '',
            smscode: '',
            inputIconShow: false,
            phoneIconColor: '#dedede',
            codeIconColor: '#dedede',
            phoneCheckFlag: false,
            codeCheckFlag: false
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
        smscode: function(v) {
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
                this.$emit('smscode', res)
            }, 1000)
        }
    }
}
</script>

<style scoped lang="scss">
.hello {
  font-size: 32px;
}
</style>
