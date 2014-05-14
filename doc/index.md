<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# cn.edu.gdmec.t00385.lightsensor

This plugin provides access to the device's light sensor. The light sensor 
detects the environment light lumen.
这个插件提供了访问设备的光线传感器的功能。光线传感器能检测设备所处环境的光照强度。

## Installation

    cordova plugin add https://github.com/gdmec/lightsensor

## Supported Platforms

- Android

## Methods

- navigator.LightSensor.getCurrentLumen
- navigator.LightSensor.watchLumen
- navigator.LightSensor.clearWatch

## Objects

- Lumen

## navigator.LightSensor.getCurrentLumen

Get the current environment light lumen.

the lumen value are returned to the `LightSensorSuccess`
callback function.

    navigator.LightSensor.getCurrentLumen(LightSensorSuccess, LightSensorError);


### Example

    function onSuccess(lumen) {
        alert('lumen:'+ lumen.value);
    };

    function onError() {
        alert('onError!');
    };

    navigator.LightSensor.getCurrentLumen(onSuccess, onError);
