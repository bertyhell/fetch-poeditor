'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fetch = _interopDefault(require('isomorphic-fetch'));
var FormData = _interopDefault(require('isomorphic-form-data'));

/**
 * getStrings
 * 
 * @param {Object} config - object for https://poeditor.com/docs/api#projects_export.
 * @param {String} config.api_token - POEditor API token.
 * @param {Number} config.id - ID of project.
 * @param {String} config.language - The code of language.
 * @param {('po'|'pot'|'mo'|'xls'|'csv'|'resw'|'resx'|'android_strings'|'apple_strings'|'xliff'|'properties'|'key_value_json'|'json'|'xmb'|'xtb')} config.type - File format.
 * @param {(String[]|'translated'|'untranslated'|'fuzzy'|'not_fuzzy'|'automatic'|'not_automatic'|'proofread'|'not_proofread')} [config.filters] - Filter results  (only available when Proofreading is set to "Yes" in Project Settings).
 * @param {(String|String[])} [config.tags] - Filter results by tags.
 */

function getStrings(_ref) {
  return new Promise(function ($return, $error) {
    var _ref$api_token, api_token, id, _ref$language, language, _ref$type, type, _ref$filters, filters, tags, formData, response, json, url, res, strings;

    _ref$api_token = _ref.api_token, api_token = _ref$api_token === void 0 ? process.env.POEDITOR_API_TOKEN : _ref$api_token, id = _ref.id, _ref$language = _ref.language, language = _ref$language === void 0 ? 'en' : _ref$language, _ref$type = _ref.type, type = _ref$type === void 0 ? 'key_value_json' : _ref$type, _ref$filters = _ref.filters, filters = _ref$filters === void 0 ? ['translated', 'proofread'] : _ref$filters, tags = _ref.tags;
    formData = new FormData();
    formData.append('api_token', api_token);
    formData.append('id', id);
    formData.append('language', language);
    formData.append('type', type);

    if (filters) {
      switch (filters.constructor.name) {
        case 'Array':
          filters.forEach(function (filter) {
            return formData.append('filters[]', filter);
          });
          break;

        case 'String':
          formData.append('filters', filters);
      }
    }

    if (tags) {
      switch (tags.constructor.name) {
        case 'Array':
          tags.forEach(function (tag) {
            return formData.append('tags[]', tag);
          });
          break;

        case 'String':
          formData.append('tags', tags);
      }
    }
    /**
     * Let's ask for URL to our lovely data :3
     *  Why don't they simply return data? idk
     */


    return Promise.resolve(fetch('https://api.poeditor.com/v2/projects/export', {
      method: 'POST',
      body: formData
    })).then(function ($await_1) {
      try {
        response = $await_1;
        return Promise.resolve(response.json()).then(function ($await_2) {
          try {
            json = $await_2;
            url = json.result.url;
            if (!url) return $error(new Error("We didn't get URL from PO :S"));
            /**
             * Fetch Strings ❤️
             */

            return Promise.resolve(fetch(url)).then(function ($await_3) {
              try {
                res = $await_3;
                return Promise.resolve(res.json()).then(function ($await_4) {
                  try {
                    strings = $await_4;
                    return $return(strings);
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }, $error);
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }, $error);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
}

module.exports = getStrings;
