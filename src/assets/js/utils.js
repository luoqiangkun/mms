//获取cookie、
export function getCookie(name) {
 var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
 if (arr = document.cookie.match(reg))
  return (arr[2]);
 else
  return null;
}
 
//设置cookie,增加到vue实例方便全局调用
export function setCookie (c_name, value, expiredays) {
 var exdate = new Date();
 exdate.setDate(exdate.getDate() + expiredays);
 document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};
 
//删除cookie
export function delCookie (name) {
 var exp = new Date();
 exp.setTime(exp.getTime() - 1);
 var cval = getCookie(name);
 if (cval != null)
  document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

export function isSupportStorage()
{
    if (typeof window.localStorage == 'object')
    {
        return true;
    }
    else
    {
        return false;
    }
}


export function getLocalStorage(key)
{
    return getCookie(key);
}

export function setLocalStorage(key, value, h)
{
    if (typeof h == 'undefined')
    {
        h = 24 * 365 * 5;
    }

   return setCookie(key, value, h);
}


export function delLocalStorage(key)
{
    return delCookie(key);
}

export function updateLocalStorage(key, value, h)
{
    return setCookie(key, value, h);
}


export function isWeixin(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == "micromessenger") {
        return true;
    }
    return false;
}

/**
 * 动态加载js文件
 * @param script_filename js文件路径
 */
export function loadJs(script_filename) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', script_filename);
    script.setAttribute('id', 'auto_script_id');
    script_id = document.getElementById('auto_script_id');
    if (script_id) {
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}


export function userBrowser(){
    var browserName=navigator.userAgent.toLowerCase();
    if(/SuteshopCode/i.test(browserName)){

        return true;
    }else{
        //是否微信打开
        return isWeixin();
    }
}

export function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if (name == 'store_id')
    {
        if (!SYS.MULTISHOP_ENABLE)
        {
            return SYS.STORE_ID;
        }
    }

    if (r!=null) return r[2]; return '';
}
