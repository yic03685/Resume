/**
 * Created by yi on 2015/3/21.
 */

import WorkList from "models/WorkList";

const PHOTO_ITEM_WIDTH = 300;
const PHOTO_LIST_MARGIGN = 50;

class WorkItem {

    constructor() {

    }

    ready(imports) {
        this.info = imports["initialValue"];
        this.expanded = false;

        this.photoListWidth = this.info.map(x=>x.achievement)
            .filter(x=>x)
            .map(ls=>ls[0].photos.length)
            .map(x=>x*PHOTO_ITEM_WIDTH + PHOTO_LIST_MARGIGN);
    }

    switch() {
        this.expanded = this.expanded? false: true;
    }
}

Graph.repeat("WorkItem", WorkItem).in("WorkList.items");