<template>
    <div>
        <yd-popup :close-on-masker="false" v-model="show1" position="center" width="90%">
            <div class="login-wrap">
                <div class="inner-body">
                    <h3 class="header-title">实名认证</h3>
                    <div class="com-authentication">
                        <yd-cell-group>
                            <yd-cell-item>
                                <yd-icon slot="icon" :color="nameIconColor" name="ucenter-outline" size=".45rem"></yd-icon>
                                <yd-input slot="right" v-model="userName" max="14" ref="mobileref" :show-error-icon="inputIconShow" :show-success-icon="inputIconShow" placeholder="请输入姓名"></yd-input>
                            </yd-cell-item>
                            <yd-cell-item>
                                <yd-icon slot="icon" :color="idcardIconColor" name="discount" size=".45rem"></yd-icon>
                                <yd-input slot="right" v-model="idcard" max="18" ref="mobileref" :show-error-icon="inputIconShow" :show-success-icon="inputIconShow" placeholder="请输入身份证号码"></yd-input>
                            </yd-cell-item>
                            <yd-cell-item>
                                <yd-icon slot="icon" :color="phoneIconColor" name="phone3" size=".45rem"></yd-icon>
                                <yd-input slot="right" v-model="phonenum" max="14" ref="mobileref" :show-error-icon="inputIconShow" :show-success-icon="inputIconShow" placeholder="请输入手机号码"></yd-input>
                            </yd-cell-item>
                        </yd-cell-group>
                        <div class="btn">
                            <yd-button size="large" :disabled="btndisabled" @click.native="loginByCode()" type="warning" shape="circle">登陆</yd-button>
                        </div>
                    </div>
                </div>
            </div>
        </yd-popup>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'authentication',
    data() {
        return {
            show1: true,
            start1: false,
            phonenum: this.mobile,
            userName: '',
            inputIconShow: false,
            phoneIconColor: '#dedede',
            idcardIconColor: '#dedede',
            nameIconColor: '#dedede',
            phoneCheckFlag: false,
            idCheckFlag: false,
            nameCheckFlag: false,
            idcard: ''
        }
    },
    created() {},
    computed: {
        ...mapState('login', ['user', 'token', 'mobile']),
        btndisabled: (vm) => {
            const tag = vm.idCheckFlag && vm.nameCheckFlag && vm.phoneCheckFlag
            return !tag
        }
    },
    watch: {
        phonenum: function(v) {
            const reg = /^(86){0,1}1[3-9]{1}\d{9}$/
            const reg2 = /^[1][3,4,5,6,7,8,9][0-9]\*{4}[0-9]{4}$/;
            const flag = reg.test(v) || reg2.test(v)
            this.phoneIconColor = !flag ? '#dedede' : '#1a95ea'
            this.phoneCheckFlag = flag
        },
        userName: function(v) {
            const reg = /^[\u4E00-\u9FA5]{2,14}$/;
            const flag = reg.test(v)
            this.nameIconColor = !flag ? '#dedede' : '#1a95ea'
            this.nameCheckFlag = flag
        },
        idcard: function(v) {
            const flag = this.identityCodeValid(v)
            this.idcardIconColor = !flag ? '#dedede' : '#1a95ea'
            this.idCheckFlag = flag
        }
    },
    mounted() {
        this.phonenum = this.mobile
        const reg = /^(86){0,1}1[3-9]{1}\d{9}$/
        const reg2 = /^[1][3,4,5,6,7,8,9][0-9]\*{4}[0-9]{4}$/;
        const flag = reg.test(this.phonenum) || reg2.test(this.phonenum)
        this.phoneIconColor = !flag ? '#dedede' : '#1a95ea'
        this.phoneCheckFlag = flag
    },
    methods: {
    // 身份证号合法性验证
        identityCodeValid(code) {
            let city = {
                11: '北京',
                12: '天津',
                13: '河北',
                14: '山西',
                15: '内蒙古',
                21: '辽宁',
                22: '吉林',
                23: '黑龙江 ',
                31: '上海',
                32: '江苏',
                33: '浙江',
                34: '安徽',
                35: '福建',
                36: '江西',
                37: '山东',
                41: '河南',
                42: '湖北 ',
                43: '湖南',
                44: '广东',
                45: '广西',
                46: '海南',
                50: '重庆',
                51: '四川',
                52: '贵州',
                53: '云南',
                54: '西藏 ',
                61: '陕西',
                62: '甘肃',
                63: '青海',
                64: '宁夏',
                65: '新疆',
                71: '台湾',
                81: '香港',
                82: '澳门',
                91: '国外 '
            }
            let tip = ''
            let pass = true
            // 验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
            if (
                !code ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
            code
        )
            ) {
                tip = '身份证号格式错误'
                pass = false
            } else if (!city[code.substr(0, 2)]) {
                tip = '地址编码错误'
                pass = false
            } else {
                // 18位身份证需要验证最后一位校验位
                if (code.length === 18) {
                    code = code.split('')
                    // 加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
                    // 校验位
                    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
                    var sum = 0
                    var ai = 0
                    var wi = 0
                    for (var i = 0; i < 17; i++) {
                        ai = code[i]
                        wi = factor[i]
                        sum += ai * wi
                    }
                    if (parity[sum % 11] !== code[17]) {
                        tip = '校验位错误'
                        pass = false
                    }
                } else {
                    pass = false
                }
            }
            return pass
        },
        loginByCode() {
            if (!this.phoneCheckFlag || !this.idCheckFlag || !this.nameCheckFlag) {
                this.$dialog.toast({
                    mes: '请填写正确的信息',
                    timeout: 1500,
                    icon: 'error'
                })
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
    .goback {
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
