//app.js
App({
  onLaunch: function () {
    /**
         * sessionId
         * isLogin
         * pageTo 授权后跳转页面 
         * pageToFlag 授权后跳转页面标志 order->预定页 order-list->订单页
         * phone
         * realName
         * touristList 常旅
         * customer从常旅中选择的取票人信息包括手机,姓名,证件号,证件类型
         * tourists出游人
         * psptType 取票人的证件类型
         */
    let timestampNow = Date.parse(new Date);
    let timestampExpiresOld = wx.getStorageSync('timestampExpires');
    if(!timestampExpiresOld || timestampNow > timestampExpiresOld){
      wx.setStorageSync('sessionId','');
      wx.setStorageSync('isLogin',false);
      wx.setStorageSync('sessionKey','');
      wx.setStorageSync('loginKey','');
      let timestampExpiresNew = timestampNow + 5 * 24 * 60 * 60 * 1000; //5天  
      wx.setStorageSync('timetampExpires',timestampExpiresNew);
    }
    wx.setStorageSync('authFlag',0 ); 
    wx.setStorageSync('pageTo','');
    wx.setStorageSync('pageToFlag','');
    wx.setStorageSync('phone','');
    wx.setStorageSync('loginPhone','');
    wx.setStorageSync('realName','');
    wx.setStorageSync('touristList',[]);
    wx.setStorageSync('customer',{});
    wx.setStorageSync('tourists',[]);
    wx.setStorageSync('psptInfoSelect',[]);
    wx.setStorageSync('psptType',null );
    wx.setStorageSync('availableCredentials',[]);
    wx.setStorageSync('TICKET_SELECTED_DES','');
    this.getSystemInfo();

  },
  onShow:function(){
    console.log('---onShow---');
  },
  onHide:function(){
    console.log('---onHide---');
  },
  component:function(fileName){
    return require('/components/' + fileName);
  },
  module:function(fileName){
    return require('/pages/modules/' + fileName +'_modules.js');
  },
  getSystemInfo(){
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.windowHeight=res.windowHeight+'px';
      }
    })
  },
  globalData: {
    userInfo: null,
    windowHeight:0,
    orderInfo:{
      planDate:'',
      price:0
    }
  }
})