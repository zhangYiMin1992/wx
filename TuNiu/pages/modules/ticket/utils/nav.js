/**
 * 处理页面跳转5层限制
 * @param json 
 */
import { parseJSON } from 'stringify';
import cache from 'cache'
export function go2Page(opts) {
  if (!opts) return;
  if (!opts.url) return;
  var url = opts.url;
  var history = getCurrentPages();
  console.log(history);
  var path = url.split('?');
  var params = void 0;
  if (path.length === 2) {
    params = path[1]
  }
  var page = path[0].split('/').pop();
  var index = -1;
  for (var i = 0; i < history.length; i++) {
    var hPath = history[i].__route__;
    var hPage = hPath.split('/').pop();
    if (page == hPage) {
      index = i;
      break
    }
  }
  if (index === -1) {
    wx.navigateTo({
      url: url
    })
  } else {
    if (params) {
      params = parseJSON(params)
    }
    cache.store.put(page, params);
    wx.navigateBack({
      delta: history.length - (index + 1)
    })
  }
};