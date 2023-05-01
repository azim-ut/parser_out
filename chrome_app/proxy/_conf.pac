function FindProxyForURL(url, host) {
    url = url.toLowerCase();
    host = host.toLowerCase();
    if (isPlainHostName(host)){
        return 'DIRECT';
    }

    var proxy = 'PROXY svetlana.ltespace.com:15219';
    var credentials = 'k5hcfhy9:68kvs146';

    //     var proxy = 'PROXY svetlana.ltespace.com:15219';
    //     var credentials = '4szelqicry:m71vs1ky81-country-RU';
    console.log(host);
    if (shExpMatch(host,"*leroymerlin.ru*") || shExpMatch(host,"*whatismyipaddress.com*")) {
        return 'PROXY ' + proxy + '; PROXY ' + proxy + ' ' + credentials + '; DIRECT';
    } else {
        return 'DIRECT';
    }
}