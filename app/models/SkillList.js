/**
 * Created by yi on 2015/3/29.
 */

import List from "templates/List";

const DATA_URL = "../app/data/skills.json";

class SkillList extends List {

    constructor() {
        this.dataUrl = DATA_URL;
    }
}

Graph.put("SkillList", SkillList);