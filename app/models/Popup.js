/**
 * Created by yi on 2015/3/25.
 */

import Rx from "rx";

class Popup {


    constructor() {
        this.registerAction("open", this.open.bind(this));
        this.registerAction("close", this.close.bind(this));
    }

    ready() {
        this.poster = "";
        this.from = "";
        this.to = "";
        this.state = "";
        var $state = this.observe("state").filter(x=>x!=="");
        var animationDuration = 500;

        var $reset = Rx.Observable.zip(
            this.observe("from").filter(x=>x!==""),
            this.observe("to").filter(x=>x!==""),
            (f, t) => ({from:f, to:t})
        );

        var $readyOpen = $reset.delay(80).map(x=>"readyOpen");
        var $open = Rx.Observable.zip(
            $readyOpen.delay(80),
            $state.filter(x=>x==="open"),
            (r, o) => o
        );
        var $readyClose = Rx.Observable.zip(
            $open,
            $state.filter(x=>x==="closed"),
            (o, c) => "readyClose"
        );
        var $closed = $readyClose.delay(animationDuration).map(x=>"closed");

        this.computedState = Rx.Observable.merge(
            $readyOpen,
            $open,
            $readyClose,
            $closed
        );

        this.geom = Rx.Observable.combineLatest(
            this.computedState,
            $reset,
            (s, location) => s === "readyOpen" || s === "readyClose" || s === "closed" ? {
                width: location.from.width,
                height: location.from.height,
                scale: "1, 1, 1",
                translate:  location.from.left + "px,"+ location.from.top + "px,0",
                centerTranslate: "0, 0, 0"
            } : {
                width: location.from.width,
                height: location.from.height,
                scale: "2.66, 2.66, 2.66",
                translate:  "50%, 50%, 0",
                centerTranslate: "-50%, -50%, 0"
            }
        );

        this.description = "";
        this.likeCount = 0;
        this.photoId = "";

        this.posterUrl = this.observe("poster").map(x=>"assets/thumbnails/"+x+".jpg");
    }

    open(info) {
        this.poster = info.url;
        this.from = info.location;
        this.to = {left:417, top:400, width:600, height:400};
        this.state = "open";
        this.description = info.description;
        this.likeCount = info.likeCount;
        this.photoId = info.photoId;
    }

    close() {
        this.state = "closed";
    }
}

Graph.put("Popup", Popup);
