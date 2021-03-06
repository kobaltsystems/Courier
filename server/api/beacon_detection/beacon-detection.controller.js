'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var beaconDetectionService = require('../../service/beacon-detection.service.js');


/**
 * GET /api/beacondetections -> unfiltered array of all beacon detections
 *
 * Optional query parameters:
 *  1) uuid: beacon uuid
 *  2) agentId: agent custom id (generally the mac address)
 *  3) time:
 *      Supported comparators:
 *          - gt = greater than
 *          - gte = grater than or equal
 *          - lt = less than
 *          - lte = less than or equal
 *
 *      Example ranges:
 *          time=gte 2013-10-09T08:40 lte 2014-10-09T08:40
 *          time=gte 2014-10-09T08:40
 *          time=gt 2014-10-09T08:40
 *          time=lte 2014-10-09T08:40
 *          time=lt 2014-10-09T08:40
 *
 * GET /api/beacondetections?time= ->
 * GET /api/beacondetections?uuid= ->
 * GET /api/beacondetections?agentId= ->
 *
 *   [
 *       {
 *          "_id" : "5432bbbbe4ca5c9a22bc765f",
 *          "proximity" : 1.91,
 *          "major" : 1,
 *          "uuid" : "123e4567e89b12d3a456426655440000",
 *          "tx" : -62,
 *          "time" "2014-10-06T15:56:43.793Z",
 *          "rssi" : -75,
 *          "minor" : 2,
 *          "agentId" : "00:A0:C9:14:C8:29"
 *       }
 *   ]
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var uuid = req.query.uuid;
    var agentId = req.query.agentId;
    var time = req.query.time;
    beaconDetectionService.findFilteredDetections(uuid, agentId, time)
        .then(function (detections) {
            return res.json(200, detections);
        }, function (err) {
            return handleError(res, err);
        });
}

/**
 * POST /api/beacondetections
 * Creates one or more beacon detections.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    var detections = req.body;

    if (!(detections instanceof Array)) {
        // assume single object sent and wrap in array
        detections = [detections];
    }

    // logging
    var logLine = JSON.stringify(detections);
    console.log(logLine);
//    if (config.log.beaconDetections === true) {
//        logger.detections(logLine);
//    }

    beaconDetectionService.processNewDetectionData(detections)
        .then(function(result){
            return res.json(201, result);
        }, function(err) {
            return handleError(res, err);
        });
};

//[Lindsay Thurmond:10/31/14] TODO: we probably don't actually want to expose this, I'm just exposing it for convenience for now
//exports.destroyAll = function (req, res) {
//    beaconDetectionService.deleteAllDetections()
//        .then(function () {
//            res.send(204);
//        }, function (err) {
//            return handleError(res, err);
//        });
//}

function handleError(res, err) {
    return res.send(500, err);
}
