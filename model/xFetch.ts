/**
 * 网络状态返回非200会reject
 * @param response
 */
function parseResponse(response) {
  if (response.status / 200 !== 1) {
    return Promise.reject({
      des: `网络错误:${response.status}`,
    });
  }
  return response.json();
}

/**
 * 网络请求
 * @param url
 * @param options
 * @param NET_TIME
 */
function xFetch(url: string, options: any, NET_TIME?) {
  return Promise.race([
    fetch(url, options).then(parseResponse),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({ des: '网络超时' });
      }, NET_TIME || 30000);
    }),
  ]);
}

export default xFetch;
