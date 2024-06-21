var i18n = require('i18n');
i18n.configure({
  locales:['en', 'es', 'vn'],
  directory: __dirname + '/locales',
	defaultLocale: 'en',
  queryParameter: 'lang',
  cookie: 'lang',
  autoReload: true,
  api: {
    '__': 'translate',
    '__n': 'translateN'
  },
  preserveLegacyCase: true,
  extension: '.js',
  //register: global
});
//i18n.setLocale('en');
module.exports = i18n;
