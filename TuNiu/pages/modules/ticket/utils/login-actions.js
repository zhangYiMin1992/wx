//判断是否登录
import appConfig from '../appConfig';
import { go2Page } from '../utils/nav';
import cache from '../utils/cache';


function loginEvent(self, callback, fail) {
  let sessionId = wx.getStorageSync('sessionId');
  wx.request({
    url: appConfig.APIs.beginSession,
    data: {
      d: JSON.stringify({
        sessionId: sessionId
      })
    },
    method: 'GET',
    success: function (res) {
      //判断是否登录操作
      wx.setStorageSync('isLogin', !!res.data.data.isLogin);
      wx.setStorageSync('sessionId', res.data.data.sessionId);
      if (callback) callback(self, fail);
    },
    fail() {
      if (fail) fail(self);
    }
  });
}

//是否需要验证码
function checkCaptcha(callback, fail) {
  wx.request({
    url: appConfig.APIs.captcha,
    data: {
      d: JSON.stringify({
        sessionId: wx.getStorageSync('sessionId'),
        tel: wx.getStorageSync('phone'),
        type: 1,
      })
    },
    method: 'GET',
    success: function (res) {
      // sucloginEventcess
      let data = res.data.data;
      console.log(data);
      callback(data);
    },
    fail() {
      fail();
    }
  })
}

//发送动态密码
function sendCode(self, captcha, errorCb, successCb, fail) {
  wx.request({
    url: appConfig.APIs.sendCode,
    data: {
      d: JSON.stringify({
        sessionId: wx.getStorageSync('sessionId'),
        tel: wx.getStorageSync('phone'),
        captcha: captcha
      })
    },
    method: 'GET',
    success: function (res) {
      if (!res.data.success) {
        errorCb(self, res);
        return;
      }
      successCb(self);
    },
    fail() {
      fail(self);
    }
  })
}

//登录
function login(self, password, captcha, errorLoginCb, successLoginCb, fail) {
  wx.request({
    url: appConfig.APIs.weapplogin,
    data: {
      d: JSON.stringify({
        sessionId: wx.getStorageSync('sessionId'),
        loginId: wx.getStorageSync('phone'),
        password: password,
        captcha: captcha,
        rgEntrance: '030000/006001/000010/000000'
      })
    },
    method: 'GET',
    success: function (res) {
      if (!res.data.success) {
        errorLoginCb(self, res);
        return;
      }
      wx.setStorageSync('isLogin', true);
      wx.setStorageSync('loginPhone', res.data.data.phoneNum);
      wx.setStorageSync('realName', res.data.data.realName);
      successLoginCb(self);
    },
    fail() {
      fail(self);
    }
  })
}

//授权判断
function userLoginEvent(fail) {
  let sessionKey = wx.getStorageSync('sessionKey');
  let authFlag = wx.getStorageSync('authFlag');
  if (authFlag == 1) {
    //用户已经授权，去请求openId接口
    wx.login({
      success: function (res) {
        let code = res.code;
        bindPreAjax(code, fail);
      }
    })
  } else if (authFlag == 2) {
    //用户不同意授权，正常登陆
    loginEvent(this, loginEventCallback, fail);
  } else {
    //用户还未做授权选择，提示用户选择
    getWxUserInfo(fail);
  }
}

//微信用户授权操作
function getWxUserInfo(fail) {
  wx.login({
    success: function (res) {
      // success
      let code = res.code;
      wx.getUserInfo({
        success: function (res) {
          // success用户同意授权
          wx.setStorageSync('authFlag', 1);
          bindPreAjax(code, fail);
        },
        fail: function () {
          // fail用户拒绝授权
          wx.setStorageSync('authFlag', 2);
          loginEvent(this, loginEventCallback, fail);
        }
      });
    }
  });
}

function bindPreAjax(code, fail) {
  wx.request({
    url: appConfig.APIs.bindPreAjax,
    data: {
      sessionKey: wx.getStorageSync('sessionKey'),
      code: code,
      pValue: appConfig.config.pValue,
      serviceId: appConfig.config.serviceId
    },
    method: 'GET',
    success: function (res) {
      //获取openId成功后，到登录页面走绑定流程
      wx.setStorageSync('sessionKey', res.data.data.sessionKey);
      bindPartnerUser(fail);
    },
    fail() {
      fail();
    }
  });
}

function bindPartnerUser(fail) {
  wx.request({
    url: appConfig.APIs.bindPartnerUserAjax,
    data: {
      sessionKey: wx.getStorageSync('sessionKey'),
      sessionId: wx.getStorageSync('sessionId'),
      pValue: appConfig.config.pValue
    },
    method: 'GET',
    success: function (res) {
      wx.hideToast();
      if (res.data.success == true && res.data.errorCode == 410001) {
        //用户未登录,走登录流程,登录后帮用户绑定
        loginEvent(this, loginEventCallback, fail);
      } else if (res.data.success == true && res.data.errorCode == 410000) {
        //用户已绑定，走正常流程
        wx.setStorageSync('isLogin', true);
        wx.setStorageSync('sessionKey', res.data.data.sessionKey);
        wx.setStorageSync('loginKey', res.data.data.loginKey);
        if (wx.getStorageSync('pageToFlag') == 'order') {
          wx.navigateTo({
            url: wx.getStorageSync('pageTo')
          })
        } else {
          if (wx.getStorageSync('pageToFlag') == 'index') {
            fail();
            return;
          }
          wx.redirectTo({
            url: wx.getStorageSync('pageTo')
          })
        }
      } else {
        console.log(res.data.msg);
      }
    },
    fail() {
      fail();
    }
  })
}

function loginEventCallback(self, fail) {
  let isLogin = wx.getStorageSync("isLogin");
  if (isLogin) {
    if (wx.getStorageSync('pageToFlag') == 'order') {
      wx.navigateTo({
        url: wx.getStorageSync('pageTo')
      })
    } else {
      if (wx.getStorageSync('pageToFlag') == 'index') {
        fail();
        return;
      }
      wx.redirectTo({
        url: wx.getStorageSync('pageTo')
      })
    }
  } else {
    if (wx.getStorageSync('pageToFlag') == 'order') {
      wx.navigateTo({
        url: wx.getStorageSync('pageTo')
      })
    } else {
      wx.navigateTo({
        url: '/pages/modules/ticket/login/login'
      })
    }
  }
}

module.exports = {
  loginEvent: loginEvent,
  userLoginEvent: userLoginEvent,
  checkCaptcha: checkCaptcha,
  sendCode: sendCode,
  login: login
}
