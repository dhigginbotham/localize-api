var _ = require('lodash');
var expect = require('expect.js');

var helpers = require('../../src/alpha/helpers');

describe('test helpers.js methods to ensure they\'re working the way we rely on them to', function () {

  var hasTrailingSlashUri = 'https://api.github.com/';
  var noTrailingSlashUri = 'https://api.github.com';

  var trailingSlashPath = '/path/of/endpoint/n';
  var noTrailingSlashPath = '/path/of/endpoint/n/';
  
  var trix = '/*/';
  var sanitizedTrix = '/*';

  describe('non-blocking: test removeTrailingSlash', function () {

    helpers.removeTrailingSlash(hasTrailingSlashUri, function (helperResult) {

      it('goes from ' + hasTrailingSlashUri + ' to ' + noTrailingSlashUri, function (done) {

        expect(helperResult).not.to.be(null);

        expect(helperResult).to.equal(noTrailingSlashUri);
        
        return done();

      });

    });

    helpers.removeTrailingSlash(noTrailingSlashPath, function (helperResult) {

      it('goes from ' + noTrailingSlashPath + ' to ' + trailingSlashPath, function (done) {

        expect(helperResult).not.to.be(null);

        expect(helperResult).to.equal(trailingSlashPath);
        
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

    it('goes from ' + hasTrailingSlashUri + ' to ' + noTrailingSlashUri, function (done) {
      
      var helperResult = helpers.removeTrailingSlash(hasTrailingSlashUri);

      expect(helperResult).not.to.be(null);
      expect(helperResult).to.equal(noTrailingSlashUri);

      return done();

    });

    it('goes from ' + noTrailingSlashPath + ' to ' + trailingSlashPath, function (done) {
      
      var helperResult = helpers.removeTrailingSlash(noTrailingSlashPath);

      expect(helperResult).not.to.be(null);
      expect(helperResult).to.equal(trailingSlashPath);

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