/**
 * 各种类型的字符串化
 * add by Daniel He
 *
 */

/**
 * 处理query String
 * @param json
 * @returns {string}
 */
export function query(json) {
  return '?' +
    Object.keys(json).map((key) => {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key]);
    }).join('&');
}

/**
 * 处理query String JSON版
 * @param json
 * @returns {string}
 */
export function queryJson(json, c) {
  let ret = {
    d: JSON.stringify(json)
  }

  if (c) {
    ret['c'] = JSON.stringify(c);
  }

  return query(ret)
}

/**
 * 处理JSON String
 * @param json string
 * @returns {json}
 */
var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ?
  function (obj) {
    return typeof obj
  } : function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
  };
export function parseJSON(queryString) {
  if (!queryString) return {};
  try {
    var _ret = function () {
      var quries = queryString.split('&');
      var ret = {};
      if (quries && quries.length) {
        quries.forEach(function (query) {
          var arr = query.split('=');
          ret[arr[0]] = arr[1]
        })
      }
      return {
        v: ret
      }
    }();
    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === 'object') return _ret.v
  } catch (e) {
    console.log('Parse QueryString Fail', e)
  }
};
/*
 * 处理微信小程序POST请求
 * @param json
 * @returns {string}
 */
export function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}