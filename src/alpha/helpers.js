var helpers = {};

helpers.removeTrailingSlash = function (string, fn) {

	var s = string || null;

	var callback = ((typeof fn != 'undefined') && (typeof fn == 'function')) ? fn : null;

	var sanitized, hasTrailingSlash, ln;

	if (s) {

    ln = s.length;

    hasTrailingSlash = (s[ln - 1] == '/') ? true : false;

    if (hasTrailingSlash) {

      sanitized = s.substring(0, (ln - 1));

    };

	};

  if (callback) {
    return callback(sanitized);
  } else {
    return sanitized;
  }

};

module.exports = helpers;