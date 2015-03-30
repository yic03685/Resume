/**
 * Created by yi on 2015/3/21.
 */

import List from "templates/List";
import Popup from "models/Popup";

const DATA_URL = "../app/data/work-experience.json";

class WorkList extends List {

    constructor() {
        this.dataUrl = DATA_URL;
    }
}

Graph.put("WorkList", WorkList, "Popup");