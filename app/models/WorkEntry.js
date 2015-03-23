/**
 * Created by yi on 2015/3/22.
 */

import WorkItem from "models/WorkList";

class WorkEntry {

    constructor() {

    }

    ready(imports) {
        this.info = imports["initialValue"];
        this.expanded = false;
    }
}

Graph.repeat("WorkEntry", WorkItem).in("WorkItem.info.achievements");