/**
 * Created by yi on 2015/3/29.
 */

import SkillList from "models/SkillList";

class SkillItem {

    constructor() {

    }

    ready(imports) {
        this.info = imports["initialValue"];
        this.expanded = false;
    }

    switch() {
        this.expanded = this.expanded? false: true;
    }
}

Graph.repeat("SkillItem", SkillItem).in("SkillList.items");