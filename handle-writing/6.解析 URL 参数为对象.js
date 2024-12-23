function parseParam(url) {
  let paramStr = /.+\?(.+)$/.exec(url)[1];
  let paramArr = paramStr.split('&');
  let paramObj = {};
  paramArr.forEach(param => {
    if (/=/.test(param)) {
      let [key, value] = param.split('=');
      value = decodeURIComponent(value);
      if (paramObj.hasOwnProperty(key)) {
        paramObj[key] = [].concat(paramObj[key], value);
      } else {
        paramObj[key] = value;
      }
    } else {
      paramObj[param] = true;
    }
  });
  return paramObj;
}
