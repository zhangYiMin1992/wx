import {httpsProtocol,cityLthLimit} from'../utils/helper';
import cache from '../utils/cache';
import config from '../appConfig';
const SELECTED_CITY='TICKET_SELECTED_CITY';
const CITY_SWITCH_TS='TICKET_CITY_SWITCH_TS';
const GEO_CITY ='TICKET_GEO_CITY';
const SELECTED_DES='TICKET_SELECTED_EDS';
const EXPIRED = 3*60*60*1000;
let lockPay=false;
let isReject=false;

let APIs=config.APIs;
const PAGE_SIZE=10;

Page({
  data: {
    header:{
      name:'index',
      city:cityLthLimit('北京'),
      des:''
    },
    page:1,
    keyword:"北京",
    location:[],
    cityCode:"40002",
    letter:"bj",
    loadText:"正在加载中...",
    tabIndex:1, 
    listHeight: (getApp().globalData.windowHeight).replace('px', '') - 51 - 52,
    isShowFail:false,
    list:[],
    orderList:[],
    pageLimit:6,
    pageNum:1,
    pageEnd:false,
    failText:'您还没有提交订单哦~',
    orderlistHeight:(getApp().globalData.windowHeight).replace('px','')-51
  },
  onLoad: function (options) {
    cache.store.put('index',{isrender:1});
  },
  onShow: function () {
    let index=cache.store.get('index');
    if(index && index.isrender == 0){
      if(index.tabIndex == 2 && index.isrender_ol == 1){
        this.setData({
          tabIndex:2,
          orderList:[],
          pageNum:1,
          pageEnd:false
        });
        this.getOrderList();
      }
      return;
    }
    //页面显示
    let city=cache.store.get(SELECTED_CITY);
    let name=city?city.name : this.data.keyword;
    let code=city?city.code : this.data.cityCode;
    let des= cache.store.get(SELECTED_DES);
    this.setData({
      keyword : des ? des : name,
      cityCode:code,
      header:{
        name:'index',
        city:cityLthLimit(name),
        des:des
      },
      page:1,
      location:[],
      list:[],
      loadText:"正在加载中..."
    });
    this.getPageData();
    this.getCurrentPosition();
  },
  onShareAppMessage(){
    let city = cache.store.get("TICKET_SELECTED_CITY") || {name:'北京'};
    let cityName = city.name;
    return{
      title:'景点门票',
      desc:'一起去玩吧！',
      path: '/pages/modules/ticket/index/index?sharename=' + encodeURIComponent(cityname)
    }
  },
  modifyList(list) {
    for(let i = 0, len = list.length; i <len; i++) {
      list[i].image = httpsProtocol(list[i].image);
    }
    return list;
  },
  bindShowCity:function(){
    cache.store.put('index',{isrender:0});
    ge2Page({url:'../city-picker/city-picker'});
  },
  getPageData:function(){
    let self = this;
    let data = self.data;
    wx.request({
      url:APIs.search,
      data:{
        d:{"page":data.page, "limit":PAGE_SIZE,"keyword":self.data.keyword,"location":[]},
        c:{"cc":self.data.citycode}
      },
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        let json = res.data;
        let loadText = "正在加载中...";
        if(json.success){
          let nextPage=json.data.list;
          nextPage=self.modifyList(nextPage);
          if(nextPage && nextPage.length > 0){
            let list = data.list;
            list.push.apply(list,nextPage);
            self.setData({
              list:list
            })
            loadText = list.length < 10 ? "亲，已经加载完啦～" : "正在加载中...";
          } else {
            loadText = self.data.page == 1 ? "暂无数据" : "亲，已经加载完啦～";
          }
          self.setData({
            loadText:loadText
          });
          wx.hideToast();
        }
      },
      fail:function(){
        let loadText = '您的网络断开，请重新连接';
        cache.store.put('index', {isrender:1});
        self.setData({
          loadText: loadText
        });
        wx.hideToast();
      }
    })
  },
  getCurrentPosition: function(){
    let self = this;
    let curTimestamp = +(new Date);
    let lastTimestamp = cache.store.get(CITY_SWITCH_TS);
    //用户选择间隔小于3小时，不提示
    if(lastTimestamp && lastTimestamp -  curTimestamp < EXPIRED){
      wx.showToast({
        title:'加载中',
        icon:'loading',
        duration:10000,
        mask:true
      })
      return;
    }
    //获取定位城市
    cache.store.put('index',{isrender:0});
    if(isReject) return;
    wx.getLocation({
      complete:function(res){
        var latitude = res.latitude
        var longitude = res.longitude
        if(!(res && res.latitude && res.longitude) && !isReject){
          isReject = true;
          return;
        }
        var obj={
          location:{
            lat: latitude,
            lng:longitude
          }
        }
        wx.request({
          url:APIs.getCityCode + '?data=' + JSON.stringify(obj),
          method:'GET',
          success:function(res){
            let code = res.data.data.location.code;
            let name = res.data.data.location.name;
            cache.store.put(GEO_CITY, {"code":code,"name":name});
            if(self.data.cityCode == code){
              cache.store.put(CITY_SWITCH_TS, +(new Date));
              return;
            }
            wx.showModal({
              title: '当前定位城市是' + name,
              content: '是否切换',
              success: function(res){
                if(res.confirm){
                  self.setData({
                    page:1,
                    list:[],
                    'header.city':cityLthLimit(name),
                    'header.des':'',
                    keyword:name,
                    citycode:code
                  });
                  wx.showToast({
                    title: '加载中',
                    icon:'loading',
                    duration:10000,
                    mask:true
                  })
                  cache.store.push(SELECTED_CITY,{"code": code,"name": name});
                  self.getPageDate();
                }
              },
              complete:function(res){
                cache.store.put(CITY_SWITCH_TS, +(new Date));
              }
            })
          }
        });
        
      }
    });
  },
  getOrderList() {
    let that = this;
    wx.request({
      url:APIs.orderList,
      data:{
        sessionId:wx.getStorageSync('sessionId'),
        loginKey: wx.getStorageSync('loginKey'),
        d:{
          pageNum:that.data.pageNum,
          pageLimit:that.data.pageLimit
        }
      },
      method:'GET',
      success:function(res){
        wx.hideToast();
        if(!res.data.success) return;
        if(res.data.success && res.data.data && res.data.data.length == 0){
          that.setData({
            isShowFail:true,
            failText:'未登录'
          });
          wx.setStorageSync('sessionId','');
          wx.setStorageSync('isLogin',false);
          wx.setStorageSync('sessionKey','');
          wx.setStorageSync('loginKey','');
          return;
        }
      }
    })
  },
  bindLowerList:function(){
    this.setData({
      page:this.data.page+1
    });
    this.getPageData();
  }

  
})