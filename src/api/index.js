import { get, post } from '@/axios/http.js'
function getIndex (params) {
    return get('/mock/5cb48c7ed491cd741c54456f/base/index', params)
}
function login(params) {
    const res = {
		code:0,
		data:{
			token:'token'
		}
	}
    console.log(res)
	return new Promise((resolve, reject) => {
        resolve(res)
    })
    //return post('/mock/5cb48c7ed491cd741c54456f/base/login', params)
}

export default class webMMAPi {
  static initState = (params) => {
   return get('/s.do', params)
 }
  static testJava2Json = (params) => {
   return get('/s.do', params)
 }
   static login = (params) => {
     const res = {
		code:0,
		data:{
			token:'token'
		}
	}
    console.log(res)
	return new Promise((resolve, reject) => {
        resolve(res)
    })
 }
}
