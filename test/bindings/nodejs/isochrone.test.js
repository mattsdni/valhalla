const test = require('tape');
var config = require('./fixtures/basic_config');
var Valhalla = require('../../../')(JSON.stringify(config));
var valhalla = new Valhalla(JSON.stringify(config));

test('isochrone: can return info for locations', function(assert) {
  var isochroneRequest = '{"locations":[{"lat":40.546115,"lon":-76.385076}],"costing":"pedestrian","contours":[{"time":15,"color":"ff0000"}]}';
  var isochrone = JSON.parse(valhalla.isochrone(isochroneRequest));
  assert.ok(isochrone);
  assert.equal(isochrone.features.length, 1, 'returns one feature');
  assert.equal(isochrone.features[0].geometry.type, 'LineString', 'feature returned is a linestring');
  assert.ok(isochrone.features[0].geometry.coordinates, 'feature has geometry with coordinates');
  assert.equal(isochrone.features[0].properties.color, '#ff0000', 'color returned in properties matches request');
  assert.end();
});

test('isochrone: throws error if can\'t match input to map', function(assert) {
  var badRequest = '{"locations":[{"lat":50,"lon":-76.385076}],"costing":"pedestrian","contours":[{"time":15,"color":"ff0000"}]}';
  assert.throws(() => { valhalla.isochrone(badRequest) }, /error_code: 171, http_code: 400, message: No suitable edges near location/, 'Throws an error when cant match input to map');
  assert.end();
});

test('isochrone: returns an error if request format is wrong', function(assert) {
  var badRequest = '{"locations":[40.546115,-76.385076], [40.544232,"lon":-76.385752],"costing":"auto"}';
  assert.throws(() => { valhalla.isochrone(badRequest) }, /std::exception/, 'Throws an error when request format is wrong');
  assert.end();
});
