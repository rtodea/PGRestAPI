////////TESTING///////////

var assert = require('chai').assert;
var tables = require('../endpoints/tables');
var request = require("request");

//common and settings files
var common = require("../common"),
    settings = require('../settings/settings');

var gjv = require("geojson-validation");


describe('Common', function () {
    //See if the common.respond function exists
    test("response function is defined", function () {
        assert.isDefined(common.respond);
    })

    test("escapePostGresColumns returns array", function () {
        var escaped = common.escapePostGresColumns(["a", "b", "c", "geom"]);
        assert(Array.isArray(escaped), "escapePostGresColumns result is an array");
    })

    test("escapePostGresColumns returns double quoted names", function () {
        var escaped = common.escapePostGresColumns(["a", "b", "c", "geom"]);
        escaped.forEach(function (item) {
            assert.isString(item); //Should be a string
            assert(item.substring(0, 1) == '"', "first character should be double quote");
            assert(item.substring(item.length - 1) == '"', "last character should be double quote");
        });
    })

    test("unEscapePostGresColumns returns array", function () {
        var unEscaped = common.unEscapePostGresColumns(['"a"', '"b"', '"c"', '"geom"']);
        assert(Array.isArray(unEscaped), "unEscapePostGresColumns result is an array");
    })

    test("unEscapePostGresColumns returns double quoted names", function () {
        var unEscaped = common.unEscapePostGresColumns(['"a"', '"b"', '"c"', '"geom"']);
        unEscaped.forEach(function (item) {
            assert.isString(item); //Should be a string
            assert(item.substring(0, 1) != '"', "first character should NOT be double quote");
            assert(item.substring(item.length - 1) != '"', "last character should NOT be double quote");
        });
    })

    test("GeoJSON Formatter - valid GeoJSON passes validation", function () {

        //Pass in a mock object to format as GeoJSON
        var mockObject = [{ name: "objectName1", size: "large", geom: '{"type":"Point","coordinates":[8.234,9.2342]}' },
                          { name: "objectName2", size: "medium", geom: '{"type":"Point","coordinates":[8.234,9.2342]}' },
                          { name: "objectName3", size: "small", geom: '{"type":"Point","coordinates":[8.234,9.2342]}' }
                         ];

        var outputObject = common.formatters.geoJSONFormatter(mockObject);

        //Check to see if it is valid GeoJSON
        assert.isObject(outputObject, "it should be valid GeoJSON");

        assert(gjv.valid(outputObject) == true, "GeoJSON should be valid");
    })

    test("GeoJSON Formatter - Invalid GeoJSON fails validation", function () {

        //Pass in a mock object to format as GeoJSON
        var mockObject = [{ name: "objectName1", size: "large", geom: '{"type":"Point","coordinates":[8.234,9.2342]}' },
                          { name: "objectName2", size: "medium", geom: '{"type":"Point","coordinates":[8.234,9.2342]}' },
                          { name: "objectName3", size: "small", geom: '{"type":"Point","coordinate":[8.234,9.2342]}' } //This one is missing the 's' at the end of coordinate
        ];

        var outputObject = common.formatters.geoJSONFormatter(mockObject);

        //Check to see if it is valid GeoJSON
        assert.isObject(outputObject, "it should have come out as an Object");

        assert(gjv.valid(outputObject) == false, "GeoJSON should be INvalid");
    })


    test("common.GetArguments returns arguments from POST requests", function(){
        var postreq = { method: "POST",  body: { item: 123 }};
        var args = common.getArguments(postreq);
        assert.isObject(args, "we should have an args object");
        assert(args.item == 123, "args.item should equal 123");
    })





})

