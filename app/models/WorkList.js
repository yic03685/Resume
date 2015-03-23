/**
 * Created by yi on 2015/3/21.
 */

import HttpClient from "common/HttpClient";

const DATA_URL = "http://localhost:8080/app/data/work-experience.json";

class WorkList {

    constructor() {

    }

    ready() {
        this.getRequest(DATA_URL).then(data=>{
            this.items = data;
        });

        this.items = [{}];
    }
}

Object.assign(WorkList.prototype, HttpClient);

Graph.put("WorkList", WorkList);