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