const proxyTarget = process.env.PROXY_TARGET || 'https://apps-develop.alfa.fortnox.local';
const defaultProxyOptions = {
	target: proxyTarget,
	secure: false,
	changeOrigin: true,
	cookieDomainRewrite: '',
	xfwd: true,
	logLevel: 'debug'
};

function makeOptionsWith(options = {}) {
	return Object.assign({}, defaultProxyOptions, options)
}

/*
 * Be wary of globbing rules, the pattern /foo-product?(/|/**) will match:
 *   - /foo-product
 *   - /foo-product/
 *   - /foo-product/the-rest/of/the/url
 * An invalid pattern /foo-product?(/**) will on the other hand only match
 *   - /foo-product
 *   - /foo-product/the-rest/of/the/url
 * and will not match for the trailing slash in /foo-product/ and will as
 * such not proxy.
 */
module.exports = {
	'/fs/**': makeOptionsWith({headers: {'X-DEV-LOGINPROXY': '1'}}),
	'/javascript/**': makeOptionsWith(),
	'/f2/images/**': makeOptionsWith(),
	'/api/**': makeOptionsWith(),
	'/webapp/**': makeOptionsWith(),
	'/crm/**': makeOptionsWith(),
	'/time/**': makeOptionsWith(),
	'/sie/**': makeOptionsWith({headers: {'X-DEV-LOGINPROXY': '1'}}),
	'/bureau?(/|/**)': makeOptionsWith(),
	'/mini-invoice?(/|/**)': makeOptionsWith(),
	'/time-reporting?(/|/**)': makeOptionsWith(),
	'/warehouse?(/|/**)': makeOptionsWith()
};
