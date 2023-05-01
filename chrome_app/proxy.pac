function FindProxyForURL(url, host){

    var proxy = 'svetlana.ltespace.com:15219';
    var credentials = 'k5hcfhy9:68kvs146';

	if(
	    dnsDomainIs(host, 'get-myip.com') ||
	    dnsDomainIs(host, '*.get-myip.com') ||
	    dnsDomainIs(host, 'leroymerlin.ru') ||
	    dnsDomainIs(host, '*.leroymerlin.ru') ||
	    dnsDomainIs(host, 'leroymerlin.ru') ||
	    dnsDomainIs(host, '*.leroymerlin.ru')){
            return 'PROXY ' + proxy + '; PROXY ' + proxy + ' ' + credentials + '; DIRECT';
	    }
	return 'DIRECT';
}