<template>
    <div class="home">
        <div id="nav">
            <router-link to="/">Home</router-link>|
            <router-link to="/about">About</router-link>
        </div>
<div @click='test2333()'>
    233333
</div>
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
         <img class="demo-img" alt="Vue logo" src="../assets/MM7.2.2_详情页分享_弹窗1.jpg">
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import webMMAPi from 'api/index';
import { Toast } from 'mint-ui'
import { get, post } from '@/axios/http.js'
export default {
    name: 'home',
    components: {
        HelloWorld
    },
    async created() {
        try {
            await getIndex({ pageSiza: 100, num: 10 });
        } catch (err) {
            Toast({
                message: '这里是home页面的error提示',
                position: 'bottom',
                duration: 2000
            });
        }
    },
    mounted() {
    	this.test()
    },
    methods: {
        async test2333() {
            try {
                await getIndex({ pageSiza: 100, num: 10 });
            } catch (err) {
                Toast({
                    message: '这里是home页面状态码不为200的error提示',
                    position: 'bottom',
                    duration: 7000
                });
                console.log('err', err);
            }
        },
       test (){
          webMMAPi.initState({
        		requestid: 'AllFreeFlag'
        }).then((res)=>{
        	console.log(res)
        })
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.demo-img{
		height:1rem;
		width:.5rem;
	}
</style>