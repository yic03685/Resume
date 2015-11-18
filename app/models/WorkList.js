/**
 * Created by yi on 2015/3/21.
 */

import List from "templates/List";
import Popup from "models/Popup";

const DATA_URL = "../api/works";

class WorkList extends List {

    constructor() {
        this.dataUrl = DATA_URL;
    }

    ready() {
        this.getRequest(this.dataUrl).then(data=>{
            this.items = data.work;
        });

        this.items = [{}];
    }
}

Graph.put("WorkList", WorkList, "Popup");
