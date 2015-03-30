/**
 * Created by yi on 2015/3/29.
 */

const PHOTO_ITEM_WIDTH = 300;
const PHOTO_LIST_MARGIN = 50;

class Item {

    constructor() {
    }

    ready(imports) {
        this.info = imports["initialValue"];
        this.expanded = false;

        this.photoListWidth = this.info.map(x=>x.achievement)
            .filter(x=>x)
            .map(ls=>ls[0].photos.length)
            .map(x=>x*PHOTO_ITEM_WIDTH + PHOTO_LIST_MARGIN);

        function getUrl(filename) {
            return "asssets/thumbnails/"+filename+".jpg";
        }

    }

    switch() {
        this.expanded = this.expanded? false: true;
    }
}

export default Item;