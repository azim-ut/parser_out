function FindProxyForURL(url, host) {
    var proxy = 'PROXY svetlana.ltespace.com:15219';
    var credentials = '4szelqicry:m71vs1ky81-country-RU';
    if (shExpMatch(url, 'http://*/*') || shExpMatch(url, 'https://*/*')) {
        return 'PROXY ' + proxy + '; PROXY ' + proxy + ' ' + credentials + '; DIRECT';
    } else {
        return 'DIRECT';
    }
}