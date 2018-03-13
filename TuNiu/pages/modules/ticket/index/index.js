import cache from '../utils/cache';
Page({
  data: {
    header:{
      name:'index',
      city:'上海',
      des:''
    },
    tabIndex:1, 
    //listHeight: (getApp().globalData.windowHeight).replace('px', '') - 51 - 52,
    list:[]
  },
  onLoad: function (options) {
    cache.store.put('index',{isrender:1});
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  }
})