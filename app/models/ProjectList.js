/**
 * Created by yi on 2015/3/29.
 */

import List from "templates/List";
import Popup from "models/Popup";

const DATA_URL = "../app/data/project-experience.json";

class ProjectList extends List {

    constructor() {
        this.dataUrl = DATA_URL;
    }
}

Graph.put("ProjectList", ProjectList, "Popup");