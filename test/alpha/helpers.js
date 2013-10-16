var _ = require('lodash');
var expect = require('expect.js');

var helpers = require('../../src/alpha/helpers');

describe('test helpers.js methods to ensure they\'re working the way we rely on them to', function () {

  var hasTrailingSlash = 'https://api.github.com/';
  var noTrailingSlash = 'https://api.github.com';

  var beginingSlashPath = '/path/of/endpoint/n';
  var TrailingSlashPath = '/path/of/endpoint/n/';
  
  var trix = '//';
  var sanitizedTrix = '/';

  describe('non-blocking: test removeTrailingSlash', function () {

    helpers.removeTrailingSlash(hasTrailingSlash, function (helperResult) {

      it('goes from ' + hasTrailingSlash + ' to ' + noTrailingSlash, function (done) {

        expect(helperResult).not.to.be(null);

        expect(helperResult).to.equal(noTrailingSlash);
        
        return done();

      });

    });

    helpers.removeTrailingSlash(TrailingSlashPath, function (helperResult) {

      it('goes from ' + TrailingSlashPath + ' to ' + beginingSlashPath, function (done) {

        expect(helperResult).not.to.be(null);

        expect(helperResult).to.equal(beginingSlashPath);
        
        return done();

      });

    });

    helpers.removeTrailingSlash(trix, function (helperResult) {

      it('goes from ' + trix + ' to ' + sanitizedTrix, function (done) {

        expect(helperResult).not.to.be(null);

        expect(helperResult).to.equal(sanitizedTrix);
        
        return done();

      });

    });

  });

  describe('blocking: test removeTrailingSlash', function () {

    it('goes from ' + hasTrailingSlash + ' to ' + noTrailingSlash, function (done) {
      
      var helperResult = helpers.removeTrailingSlash(hasTrailingSlash);

      expect(helperResult).not.to.be(null);
      expect(helperResult).to.equal(noTrailingSlash);

      return done();

    });

    it('goes from ' + TrailingSlashPath + ' to ' + beginingSlashPath, function (done) {
      
      var helperResult = helpers.removeTrailingSlash(TrailingSlashPath);

      expect(helperResult).not.to.be(null);
      expect(helperResult).to.equal(beginingSlashPath);

      return done();

    });
  
    it('goes from ' + trix + ' to ' + sanitizedTrix, function (done) {
      
      var helperResult = helpers.removeTrailingSlash(trix);

      expect(helperResult).not.to.be(null);
      expect(helperResult).to.equal(sanitizedTrix);

      return done();

    });
  
  });

  // end of removeTrailingSlash tests

});