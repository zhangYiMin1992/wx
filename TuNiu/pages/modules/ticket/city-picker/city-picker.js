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
    domesticCities: DOMESTIC_CITIES,
    overseaCities: FOREIGN_CITIES,
    historyCities: cache.store.get(HISTORY_CITY_ONLOCAL) || [],
    cityPickerInit: true,
    desData: null,
    currentTab: 0,//境内外区分
    popularCity: [],
    popularCityOversea: [],
    indexer: [],
    indexerOversea: [],
    citiesByLetters: [],
    allCities: [],
    citiesByLettersOversea: [],
    geoCity: cache.store.get(GEO_CITY) || { name: '上海', code: '2500' },
    searchResultCities: [],
    cid: "",//页面定位,
    isLetterShow: false,
    currentLetter: "",
    cityListHeight: (getApp().globalData.windowHeight).replace('px', '') - 52,
    showCur: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindKeyInput(e){
      let cityName=e.detail.value;
      this.setData({
          'header.isShowSch':false,
          'header.schVal':'',
          searchResultCities: cityName == '' ? [] : searchCity(this.data.allCities, cityName)
      });
  },
  bindBackIndex(e){
      go2page({url:"../index/index?isrender=0"});
  },
  bindSelectCity(e){
      let city=e.currentTarget.dataset.city;
      if(!city.code)return;
      let historyCities=cache.store.get(HISTORY_CITY_ONLOCAL) || [];
      for(var i=0,len=historyCities.length;i<len;i++){
          if(historyCities[i].code == city.code){
              historyCities.splice(i,1);
              break;
          }
      }
      historyCities.unshift(city);
      if(historyCities.length > MAX_HISTORY_CITIES_NUM){
          historyCities.pop();
      }
      cache.store.put(HISTORY_CITY_ONLOCAL,historyCities);
      cache.store.put(SELECTED_CITY,city);
      cache.store.remove(SELECTED_DES);
      go2Page({url:"../index/index?isrender=1"});
  },
  bindAnchorIndex:function(e){
      let cid=e.currentTarget.dataset.item;
      let os=e.currentTarget.dataset.os;
      cid = os == "os"?os+cid : cid;
      this.setData({
          cid:cid,
          isLetterShow:true,
          currentLetter:cid.replace('os','')
      });
      setTimeout(()=>{
          this.setData({
              isLetterShow:false
          });
      },300);
  },
  tabChange(e){
      let tabSelect=e.currentTarget.dataset.current;
      if(this.data.currentTab!=tabSelect){
          this.setData({
              currentTab:tabSelect
          })
      }
  },
  onLoad: function (options) {
      // 生命周期函数--监听页面加载
      let self = this;
      self.initData();
      let domesticCities = self.data.domesticCities;
      let overseaCities = self.data.overseaCities;
      if (!domesticCities || !overseaCities) return;
      let indexer = self.data.indexer;
      let indexerOversea = self.data.indexerOversea;
      let popularCity = domesticCities.popularCity || [];
      let popularCityOversea = overseaCities.popularCity || [];
      let citiesByLetters = self.data.citiesByLetters;
      let allCities = self.data.allCities;
      let citiesByLettersOversea = self.data.citiesByLettersOversea;
      indexer.push('定位');
      indexerOversea.push('定位');
      popularCity && indexer.push('热门');
      popularCityOversea && indexerOversea.push('热门');

      for (let i = 0, len = letters.length; i < len; i++) {
          let letter = letters[i], citiesOnLetter;
          if (citiesOnLetter = domesticCities[letter]) {
              indexer.push(letter.toUpperCase());
              citiesByLetters.push({
                  letter: letter.toUpperCase(),
                  cities: citiesOnLetter
              });
              allCities.push({
                  letter: letter.toUpperCase(),
                  cities: citiesOnLetter
              });
          }
      }

      for (let i = 0, len = letters.length; i < len; i++) {
          let letter = letters[i], citiesOnLetter;
          if (citiesOnLetter = overseaCities[letter]) {
              indexerOversea.push(letter.toUpperCase());
              citiesByLettersOversea.push({
                  letter: letter.toUpperCase(),
                  cities: citiesOnLetter
              });
              allCities.push({
                  letter: letter.toUpperCase(),
                  cities: citiesOnLetter
              });
          }
      }
      self.setData({
          indexer: indexer,
          indexerOversea: indexerOversea,
          popularCity: popularCity,
          popularCityOversea: popularCityOversea,
          citiesByLetters: citiesByLetters,
          citiesByLettersOversea: citiesByLettersOversea,
          allCities: allCities
      });
      this.setData({
          showCur: true
      });
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
      return{
          title:'途牛门票',
          desc:'我发现了好玩的地方,很想去玩,我们一起去吧',
          path: '/pages/modules/ticket/index/index'

      }
  },
  initData(){
      this.setData({
          historyCities:cache.store.get(HISTORY_CITY_ONLOCAL) || []
      });
  }

})