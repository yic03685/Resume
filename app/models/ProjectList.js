/**
 * Created by yi on 2015/3/29.
 */

import List from "templates/List";
import Popup from "models/Popup";

const DATA_URL = "../api/projects";

class ProjectList extends List {

    constructor() {
        this.dataUrl = DATA_URL;
    }

    ready() {
        this.getRequest(this.dataUrl).then(data=>{
            this.items = data.project;
        });

        this.items = [{}];
    }
}

Graph.put("ProjectList", ProjectList, "Popup");