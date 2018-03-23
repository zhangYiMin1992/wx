import {isValidIdCard,isValidEmail,isValidMobileNO}from'../utils/validate-rules.js';
import {loginEvent,sendCode,login} from '../utils/login-actions.js';
import {ge2Page} from '../utils/nav';
let app = getApp();
Page({
  data: {
    networkError:false,
    windowHeight:0,
    isClear:false,
    isLogin:true,
    needCaptcha:false,
    phone:'',
    dynamicCode:'',
    imageUrl:'',
    captcha:'',
    //控制倒计时
    countDown:0,
    btnOK:false,
    col:'#666',
    errorMessage:'',
    showErrorMsg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        windowHeight:app.globalData.windowHeight   
    });
    this.getNetworkType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  getNetworkType(_self){
    let self = _self || this;
    wx.getNetworkType({
      success: function(res) {
        if(res.networkType == 'none'){
          self.setData({networkError:true});
          let timer =setTimeout(()=>{
            self.setData({netWorkError:false});
            clearTimeout(timer);
            timer=null;
          },3000)
        }
      }
    })
  },
  //回调函数
  callbackSession(self){
    let isLogin=!!wx.getStorageSync('isLogin');
    self.setData({isLogin:isLogin});
  },
  //回调函数
  errorSendcodeCallback(self,res){
    self.showErrorMsg(res.data.msg || '发送失败，请重新发送');
  },
  //回调函数
  successSendcodeCallback(self){
    self.setData({countDown:60});
    let timer = setInterval(()=>{
      self.setData({countDown:self.data.countDown - 1});
      if(!self.data.countDown){
        clearInterval(timer);
        timer = null;
      }
    },1000)
    self.showErrorMsg('动态码已发送，请注意查收');
  },
  //回调函数
  errorLoginCallback(self,res){
    self.showErrorMsg(res.data.msg || '登录失败');
  },
  //回调函数
  successLoginCallback(self){
    self.setData({isLogin:true});
    self.showErrorMsg('登录成功');
    go2Page({
      url: wx.getStorageSync('pageTo') + '?isrender=0&tabIndex=2&isrender_ol=1'
    });
  },
  //手机输入操作
  phoneEvent(e){
    if (e.detail.value.length >= 1){
      this.setData({
        isClear:true,
        phone:e.detail.value
      })
    }else{
      this.setData({
        isclear:false,
        phone:e.detail.value
      })
    }
    this.setData({
      btnOK:this.checkBtn()
    })
    if(!isValidMobileNO(e.detail.value)) return;
    wx.setStorageSync('phone',e.detail.value);
    loginEvent(this,this.callbackSession,this.getNetworkType);
  },
  inpBlur(e){
    if (!isValidMobileNO(e.detail.value)) this.showErrorMsg('手机号码格式不对');
  },
  imageEvent(e){
    let self = this;
    self.setData({captcha:e.detail.value});
    self.setData({btnOK:self.checkBtn()});
  },
  codeEvent(e){
    let self = this;
    self.setData({synamicCode:e.detail.value});
    self.setData({btnOk:self.checkBtn()});
  },
  codeBlur(e){
    if(e.detail.value.length!=6) this.showErrorMsg('必须是6位动态码')
  },
  //电话号码清除按钮
  clearEvent(){
    this.setData({
      phone:'',
      isClear:false,
      btnOK:false
    })
    wx.setStorageSync('phone','');
  },
  checkBtn(){
    let needCaptcha = this.data.needCaptcha;
    let phone = this.data.phone;
    let dynamicCode = this.data.dynamicCode;
    let captcha = this.data.captcha;
    let phoneAvailable = (phone !='' && phone.length == 11);
    let dynamicCodeAvailable = (dynamicCode !='' && dynamicCode.length == 6);
    let captchaAvailable = (captcha !='' && captcha.length == 4);
    if(needCaptcha){
      return phoneAvailable && dynamicCodeAvailable && captchaAvailable;
    }else{
      return phoneAvailable && dynamicCodeAvailable;
    }
  },
  //输入的合法性判断
  available(){
    let message = '';
    if(!this.data.phone){
      message = '手机号不能为空';
    }else if(!isValidMobileNO(this.data.phone)){
      message ='手机号格式不正确';
    }else if(this.data.needCaptcha){
      if(!this.data.captcha){
        message ='图形验证码不能为空';
      }else if(this.data.captcha.length!=4){
        message = '图形验证码不正确';
      }
    }
    if(message){
      this.showErrorMsg(message);
      return false;
    }
    return true;
  },
  //发送手机短信
  bindtapSendCode(e){
    if(this.data.countDown) return;
    if(!this.available())return;
    let captcha = this.data.needCaptcha ? this.data.captcha : '';
    sendCode(this,captcha,this.errorSendcodeCallback,this.successSendcodeCallback,this.getNetworkType);
  },
  //登录
  bindtapLogin(e){
    if(!this.available())return;
    if(!this.data.dynamicCode){
      return this.showErrorMsg('动态码不能为空');
    }
    login(this, this.data.dynamicCode, this.data.captcha, this.errorLoginCallback, this.successLoginCallback, this.getNetworkType);
  },
  //显示错误信息
  showErrorMsg(msg){
    this.setData({
      errorMessage:msg,
      showErrorMsg:true
    })
    this.hideErrorMsg();
  },
  hideErrorMsg(){
    let self=this;
    setTimeout(()=>{
      self.setData({
        showErrorMsg:false
      })
    },1500)
  }
})