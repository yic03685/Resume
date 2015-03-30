/**
 * Created by yi on 2015/3/25.
 */

import Rx from "rx";
import Popup from "models/Popup";

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

    }

    close() {
        this.emit("close");
    }
}

Graph.put("PopupContent", PopupContent, "Popup");
