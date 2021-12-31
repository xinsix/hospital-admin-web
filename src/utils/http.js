import axios from "axios"
import qs from 'qs'

/**
 * 创建axios对象
 */
let timestamp = new Date().getTime();
let instance = axios.create({
  /**
   * 头部信息
   */
  headers: {
    common: {
      "source-type": 1,//资源类型
       timeStamp: timestamp//时间
    }
  }
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  config => {
    // 获取token，配置请求头
    const TOKEN = "667788899";//获取token数据
    //const OverdueTime = getUserData().overdueTime;//会话过期的时间
/*    if (TOKEN) {
      // 配置请求头 token
      config.headers["token"] = TOKEN;
      config.headers["content-type"] = "application/x-www-form-urlencoded";
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Headers"] = "X-Custom-Header";
    }*/
    //请求接口时验证token是否过期
    // if (OverdueTime && OverdueTime < +new Date()) {
    //   removeUserData();
    //   if (location.pathname !== "/login") {
    //     let fullPath = location.href.replace(location.origin, "");
    //     location.href = "/login?redirect=" + encodeURIComponent(fullPath);
    //   }
    // }
    return config;
  },
  error => {
    // 对请求错误做些什么，处理这个错误
    // 可以直接处理或者展示出去,toast show()
    return Promise.reject(error);
  }
);

/**
 * 响应过滤器
 */
instance.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        const { status } = response.data;
        // 判断状态码401或者其它条件
        if (Object.is(status, 401)) {
            // token过期后处理
        }
        return response;
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

/**
 * 封装get/post请求的方法
 */
class http {
  // 使用async ... await
  static async awaitGet(url, params) {
    // console.log(params)
    return await instance.get(url, { params });
  }
  static async awaitPost(url, params) {
    // console.log(params)
    return await instance.post(url, qs.stringify(params));
  }
  static get(url, params) {
    // console.log(params)
    return new instance.get(url, { params });
  }
  static post(url, params) {
    // console.log(params)
	//qs.stringify(json对象)  相当于将json对象转换为java的意思
    //{{userId:11}} userId=11
    return instance.post(url, qs.stringify(params));
  }
}
export default http

