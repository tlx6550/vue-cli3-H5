let YDRZ = null;
(function(win, doc) {
    var opts = {
        getMobileUrl: {
            test01: 'http://120.197.235.101:8315/NumberAbility/h5/getMobile.htm?',
            pro: 'http://www.cmpassport.com/NumberAbility/h5/getMobile.htm?'
        },
        getToken: {
            test01: 'http://120.197.235.101:8315/NumberAbility/h5/getToken.htm',
            pro: 'https://www.cmpassport.com/NumberAbility/h5/getToken.htm'
        },
        optparams: {
            uuid: getUUID(),
            msgId: Math.random(),
            timestamp: dateFormat(new Date(), 'yyyyMMddhhmmssSSS'),
            userInformation: getFingerPrint(),
            isimge: false
        }
    };

    function getUUID() {
        var S4 = (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        var guid = (S4 + S4 + '-' + S4 + '-' + S4 + '-' + S4 + '-' + S4 + S4 + S4);
        return guid
    }

    function getFingerPrint() {
        return encodeURIComponent(base64encode(getBrowserInfo()))
    }

    function dateFormat(obj, fmt) {
        var o = {
            'M+': obj.getMonth() + 1,
            'd+': obj.getDate(),
            'h+': obj.getHours(),
            'm+': obj.getMinutes(),
            's+': obj.getSeconds(),
            'q+': Math.floor((obj.getMonth() + 3) / 3),
            'S+': obj.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((((RegExp.$1.length == 3 && k == 'S+') ? '000' : '00') + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
    win.YDRZ = {
        getSign: function(appId, version) {
            var signStr = appId + opts.optparams.msgId + opts.optparams.timestamp + opts.optparams.uuid + version;
            return signStr
        },
        getTokenInfo: function(opt) {
            var options = {
                version: opt.data.version,
                appId: opt.data.appId,
                openType: opt.data.openType,
                expandParams: opt.data.expandParams,
                isTest: opt.data.isTest,
                sign: opt.data.sign,
                uuid: opts.optparams.uuid,
                msgId: opts.optparams.msgId,
                timestamp: opts.optparams.timestamp,
                userInformation: opts.optparams.userInformation
            };
            var reqUrl = options.isTest === '0' ? opts.getMobileUrl.test01 : opts.getMobileUrl.pro;
            console.log(reqUrl);
            var url = reqUrl + 'version=' + options.version + '&appId=' + options.appId + '&openType=' + options.openType + '&expandParams=' + encodeURIComponent(options.expandParams) + '&msgId=' + options.msgId + '&timestamp=' + options.timestamp + '&uuid=' + options.uuid + '&userInformation=' + options.userInformation;
            var This = this;
            this.isLoaded = false;
            this.isTimeout = false;
            var img = doc.createElement('img');
            img.style.display = 'none';
            img.src = url;
            doc.body.appendChild(img);
            img.onload = function() {
                if (This.isTimeout) {
                    return
                }
                This.isLoaded = true;
                doc.body.removeChild(img);
                var param = {
                    header: {
                        version: options.version,
                        msgId: options.msgId,
                        timestamp: options.timestamp,
                        appId: options.appId
                    },
                    body: {
                        expandParams: encodeURIComponent(options.expandParams),
                        sign: options.sign,
                        uuid: options.uuid
                    }
                };
                var reqUrl = options.isTest === '0' ? opts.getToken.test01 : opts.getToken.pro;
                try {
                    request.ajax({
                        request: {
                            url: reqUrl,
                            method: 'post',
                            data: JSON.stringify(param)
                        },
                        success: function(res) {
                            if (res.result.body.token != '') {
                                var obj = {
                                    code: res.result.header.resultCode,
                                    token: res.result.body.token,
                                    userInformation: options.userInformation,
                                    message: '获取token成功'
                                };
                                opt.success({
                                    code: obj.code,
                                    message: obj.message,
                                    token: obj.token,
                                    userInformation: obj.userInformation
                                })
                            } else {
                                var obj = {
                                    code: res.result.header.resultCode,
                                    message: res.result.body.resultDesc
                                };
                                opt.error({
                                    code: obj.code,
                                    message: obj.message
                                });
                                return obj
                            }
                        },
                        error: function(res) {
                            var obj = {
                                code: '500',
                                message: '接口异常，获取token失败'
                            };
                            opt.error({
                                code: obj.code,
                                message: obj.message
                            });
                            return obj
                        }
                    })
                } catch (e) {
                    throw new Error(e)
                }
            };
            img.onerror = function() {
                if (This.isTimeout) {
                    return
                }
                opt.error({
                    code: '500',
                    message: '系统异常,图片请求失败'
                });
                This.isLoaded = true;
                doc.body.removeChild(img)
            }
        }
    };
    YDRZ = win.YDRZ
    function checkParms(opt) {
        var isflag = true;
        for (p in opt.data) {
            if (opt.data[p] === '' || opt.data[p] === undefined) {
                opt.error({
                    code: '500',
                    message: p + '为空，请检查参数是否正确'
                });
                isflag = false;
                return
            }
        }
        return isflag
    }

    function getBrowserInfo() {
        var obj = {
            'location': ['href'],
            'navigator': ['platform', 'userAgent', 'appVersion', 'cookieEnabled', 'cpuClass', 'hardwareConcurrency', 'language', 'plugins'],
            'screen': ['availWidth', 'availHeight', 'colorDepth'],
            'Date': ['getTimezoneOffset']
        };
        var str = '';
        for (var x in obj) {
            for (var i = 0; i < obj[x].length; i++) {
                var item = obj[x][i];
                if (x == 'navigator') {
                    if (item == 'plugins') {
                        try {
                            var _str = '';
                            var plugins = top[x][item] || [];
                            for (var j = 0; j < plugins.length; j++) {
                                var _item = plugins[j] || {};
                                _str += '|' + (_item.name || '')
                            }
                            str += _str.replace('|', '@@')
                        } catch (e) {
                            str += '@@'
                        }
                    } else {
                        if (item == 'language') {
                            try {
                                str += '@@' + (top[x]['language'] || top[x]['systemLanguage'] || '')
                            } catch (e) {
                                str += '@@'
                            }
                        } else {
                            try {
                                str += '@@' + (top[x][item] || '')
                            } catch (e) {
                                str += '@@'
                            }
                        }
                    }
                } else {
                    if (x == 'location' || x == 'screen') {
                        try {
                            str += '@@' + (top[x][item] || '')
                        } catch (e) {
                            str += '@@'
                        }
                    } else {
                        if (x == 'Date') {
                            str += '@@' + (((new Date())[item] && (new Date())[item]()) || '')
                        }
                    }
                }
            }
        }
        return str.replace('@@', '')
    }

    function base64encode(input) {
        var output = '';
        var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            } else {
                if (isNaN(chr3)) {
                    enc4 = 64
                }
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
        }
        return output
    }

    function _utf8_encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c)
            } else {
                if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
        }
        return utftext
    }
    var request = {
        utilCreateXHR: function(options) {
            var win = (options && options.window) || window;
            if (win.XMLHttpRequest) {
                return new win.XMLHttpRequest()
            } else {
                var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];
                for (var n = 0; n < MSXML.length; n++) {
                    try {
                        return new win.ActiveXObject(MSXML[n]);
                        break
                    } catch (e) {}
                }
            }
        },
        parseJson: function(text) {
            var obj = false;
            if (!text) {
                obj = {
                    'code': 'ER_NOBODY',
                    'summary': 'responseText is empty'
                }
            }
            if (win.JSON && JSON.parse) {
                try {
                    obj = JSON.parse(text)
                } catch (ex) {}
            }
            if (!obj) {
                try {
                    obj = eval('(' + text + ')')
                } catch (ex) {
                    obj = {
                        'code': 'ER_INVALIDJSON',
                        'summary': 'responseText is invalid json'
                    }
                }
            }
            return obj
        },
        ajax: function(args) {
            var This = this;
            var args = args || {};
            var request = args.request || {};
            var xhr = this.utilCreateXHR(args);
            var onsuccess = args.success || new Function();
            var onerror = args.error || new Function();
            var timeout = request.timeout;
            var timer = null;
            if (timeout > 0) {
                timer = setTimeout(function() {
                    if (xhr.readyState == 3 && xhr.status == 200) {
                        return
                    }
                    xhr.abort();
                    onerror({
                        result: {
                            code: 'ER_TIMEOUT',
                            summary: 'timeout'
                        }
                    })
                }, timeout)
            }
            xhr.onreadystatechange = function(data) {
                if (xhr.readyState == 4) {
                    clearTimeout(timer);
                    if (xhr.status != 0) {
                        if (xhr.status == 304 || (xhr.status >= 200 && xhr.status < 300)) {
                            onsuccess({
                                result: This.parseJson(xhr.responseText),
                                text: xhr.responseText,
                                status: xhr.status
                            })
                        } else {
                            onerror({
                                result: {
                                    code: 'ER_NETWORK',
                                    summary: 'network has error'
                                },
                                text: xhr.responseText,
                                status: xhr.status
                            })
                        }
                    } else {
                        onerror({
                            result: {
                                code: 'ER_STATUS',
                                summary: 'status is 0'
                            }
                        })
                    }
                }
            };
            var method = request.method && request.method.toLowerCase();
            xhr.open(method || 'get', request.url, true);
            var data = request.data;
            if (!request.isFormData) {
                if (typeof data === 'object') {
                    data = [];
                    for (var p in request.data) {
                        data.push(p + '=' + encodeURIComponent(request.data[p]))
                    }
                    data = data.join('&')
                }
            }
            if (request.headers) {
                for (var p in request.headers) {
                    console.log(xhr);
                    xhr.setRequestHeader(p, request.headers[p])
                }
            }
            if (method != 'post' || !data) {
                data = null
            }
            xhr.send(data)
        }
    }
})(window, document);
export default YDRZ
