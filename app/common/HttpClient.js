/**
 * Created by yi on 2015/3/22.
 */

import RSVP from "rsvp";

var SUCCESS_STATUS_CODE = 200;
var READY_STATE = 4;

var client = {

    getRequest: function (url) {
        return new RSVP.Promise(function(resolve, reject){

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange= function() {
                if (xhr.readyState === READY_STATE ) {
                    if( xhr.status === SUCCESS_STATUS_CODE ) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject({
                            error: xhr.status
                        });
                    }
                }
            };
            xhr.send();
        });
    },

    postRequest: function () {

    }
};

export default client;