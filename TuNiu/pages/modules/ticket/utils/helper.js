export function highlight(content, term) {
  return content.replace(new RegExp("(?!<[^<>]*)(" +
    term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") +
    ")(?![^<>]*>)", "i"),
    "<text class='highlight'>$1</text>");
}
export function formatDistance(raw) {
  if (raw == 0) return '';
  if (!/^(\d*,?)+(.\d*)?$/.test(raw)) return '';
  let distance = parseFloat(raw.replace(',', '')).toFixed(1);
  return distance > 500 ? ">500km" : (distance + 'km');
}
export function escapeRegex(raw) {
  return raw.replace(/([\/\\()[\]?{}|*+-.$^])/g, '\\$1');
}
export function searchCity(cities, term) {
  if (!term) return;
  var reg = new RegExp('^' + escapeRegex(term), 'i');

  var filteredCities = [];
  var itor = function (city) {
    if (reg.test(city.py) || reg.test(city.jp) || reg.test(city.name)) {
      filteredCities.push(city);
    }
  }

  for (var i = 0, len = cities.length; i < len; i++) {
    var item = cities[i];
    if (Array.isArray(item.cities)) {
      item.cities.forEach(function (city) {
        itor(city);
      })
    } else {
      for (var key in item.cities) {
        itor(item.cities[key]);
      }
    }

  }

  return filteredCities;
}
export function httpsProtocol(content) {
  return content.replace(/^(http:)?\/\//, 'https://')
}
export function replaceA(str) {
  if (!str) return;
  let reg = /<a.*?>(.*)<\/a>/g;
  return str.replace(reg, "$1");
}
export function cityLthLimit(cityName) {
  let arr = cityName.split('');
  if (cityName == '' || arr.length <= 4) return cityName;
  return arr[0] + arr[1] + '...' + arr[arr.length - 1];
}