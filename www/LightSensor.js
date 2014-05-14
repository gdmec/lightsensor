/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    utils = require('cordova/utils'),
    LightSensorLumen = require('./LightSensorLumen'),
    LightSensorError = require('./LightSensorError'),

    timers = {},
    LightSensor = {
        /**
         * Asynchronously acquires the current environment light lumen.
         * @param {Function} successCallback The function to call when the environment light lumen
         * data is available
         * @param {Function} errorCallback The function to call when there is an error
         * getting the environment light lumen data.
         * @param {LightSensorOptions} options The options for getting the environment light lumen data (not used).
         */
        getCurrentLumen:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'LightSensor.getCurrentLumen', arguments);

            var win = function(result) {
                var ch = new LightSensorLumen(result.value, result.timestamp);
                successCallback(ch);
            };
            var fail = errorCallback && function(code) {
                var ce = new LightSensorError(code);
                errorCallback(ce);
            };

            // Get environment light lumen
            exec(win, fail, "LightSensor", "getLumen", [options]);
        },

        /**
         * Asynchronously acquires the environment light lumen repeatedly at a given interval.
         * @param {Function} successCallback The function to call each time the environment light lumen
         * data is available
         * @param {Function} errorCallback The function to call when there is an error
         * getting the environment light lumen data.
         * @param {environment light lumenOptions} options The options for getting the environment light lumen data
         * such as timeout and the frequency of the watch. For iOS, filter parameter
         * specifies to watch via a distance filter rather than time.
         */
        watchLumen:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'LightSensor.watchLumen', arguments);
            // Default interval (100 msec)
            var frequency = (options !== undefined && options.frequency !== undefined) ? options.frequency : 100;
            var filter = (options !== undefined && options.filter !== undefined) ? options.filter : 0;

            var id = utils.createUUID();
            if (filter > 0) {
                // is an iOS request for watch by filter, no timer needed
                timers[id] = "iOS";
                LightSensor.getCurrentLumen(successCallback, errorCallback, options);
            } else {
                // Start watch timer to get environment light lumens
                timers[id] = window.setInterval(function() {
                    LightSensor.getCurrentLumen(successCallback, errorCallback);
                }, frequency);
            }

            return id;
        },

        /**
         * Clears the specified environment light lumen watch.
         * @param {String} watchId The ID of the watch returned from #watchenvironment light lumen.
         */
        clearWatch:function(id) {
            // Stop javascript timer & remove from timer list
            if (id && timers[id]) {
                if (timers[id] != "iOS") {
                    clearInterval(timers[id]);
                } else {
                    // is iOS watch by filter so call into device to stop
                    exec(null, null, "LightSensor", "stopLumen", []);
                }
                delete timers[id];
            }
        }
    };

module.exports = LightSensor;
