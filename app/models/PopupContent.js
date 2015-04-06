/**
 * Created by yi on 2015/3/25.
 */

import Rx from "rx";
import Popup from "models/Popup";
import HttpClient from "common/HttpClient";

const PUT_URL = "../api/Photos/like";
const GET_URL = "../api/Photos/";

class PopupContent {

    constructor() {
    }

    ready(imports) {
        var Popup = imports["Popup"];

        var $state = Popup.observe('computedState');

        this.style = Rx.Observable.merge(
            $state.filter(x=>x!=="open").map(x=>false),
            $state.filter(x=>x==="open").map(x=>true).delay(500)
        ).map(x=>x?"open":"closed");

        this.description = Popup.observe('description');
        this.photoUrl = Popup.observe('poster').map(x=>"assets/detail/"+x+".jpg");
        this.photoId = Popup.observe('photoId');

        this.photoId.subscribe(id=>{
           this._photoId = id;
        });

        this.localStorageVersion = 0;
        var $localStorageVersion = this.observe("localStorageVersion");

        this.likeCount = Rx.Observable.combineLatest(
            this.photoId,
            $localStorageVersion,
            (id, v) => this.getRequest(GET_URL+id)
        ).flatMap(function(p) {
            return Rx.Observable.fromPromise(p);
        }).map(x=>x.likeCount);


        this.isLiked = Rx.Observable.combineLatest(
            this.photoId,
            $localStorageVersion,
            (id, v) => !!localStorage.getItem(id)
        );

        this.likeIconStyle = this.isLiked.map(x=>x?"liked":"normal");
    }

    close() {
        this.emit("close");
    }

    like() {
        if(!localStorage.getItem(this._photoId)) {
            this.putRequest(PUT_URL+"?id="+this._photoId).then(x=>{
                localStorage.setItem(this._photoId, true);
                this.localStorageVersion++;
            });
        }
    }
}

Object.assign(PopupContent.prototype, HttpClient);

Graph.put("PopupContent", PopupContent, "Popup");
