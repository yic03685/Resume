/**
 * Created by yi on 2015/3/29.
 */

import HttpClient from "common/HttpClient";

class List {

    constructor() {
    }

    ready() {
        this.getRequest(this.dataUrl).then(data=>{
            this.items = data;
        });

        this.items = [{}];
    }
}

Object.assign(List.prototype, HttpClient);

export default List;