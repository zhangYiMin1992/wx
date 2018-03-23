// pages/modules/ticket/city-picker/city-picker.js
import DOMESTIC_CITIES from '../utils/domestic-cities';
import FOREIGN_CITIES from '../utils/foreign-cities';
const MAX_HISTORY_CITIES_NUM = 10
import cache from '../utils/cache';
import {searchCity} from '../utils/helper';
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const GEO_CITY='TICKET_GEO_CITY';
const HISTORY_CITY_ONLOCAL = 'TICKET_HISTORY_CITY_ONLOCAL';
const SELECTED_CITY = 'TICKET_SELECTED_CITY';
const SELECTED_DES = 'TICKET_SELECTED_DES';
import {go2Page} from '../utils/nav';
Page({
  data: {
    header:{
      name:'city-picker',
      isShowSch:false,
      schVal:''
  },
  showCur:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})