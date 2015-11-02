/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function initImgCache(){
    ImgCache.options.debug = true;

    ImgCache.init(function(){
        console.log('ImgCache init: success!');
    }, function(){
        console.log('ImgCache init: error! Check the log for errors');
    });
}

function localStorage_setItem(key, arr) 
{
	localStorage.setItem(key, JSON.stringify(arr));
}

function localStorage_getItem(key)
{
	return JSON.parse(localStorage.getItem(key));
}

function isUndefined(obj)
{
	if ((typeof obj == "undefined") || (obj == null))
		return true;
	else
		return false;
}

function hostReachable() {

    // Handle IE and more capable browsers
    var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
    var status;
    var url_to_connect = localStorage.getItem('server_base_url');
    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open( "HEAD", url_to_connect + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

    // Issue request and handle response
    try {
        xhr.send();
        return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
    } catch (error) {
        console.log("function : hostReachable   -- " + error);
        return false;
    }
}

function test_log(msg) {
    console.log("%c" + msg, "color:#080;");
}