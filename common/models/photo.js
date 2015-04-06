module.exports = function(Photo) {

    Photo.like = function (id, cb) {
        var ds = Photo.app.dataSources.mongodb;

        Photo.findOne({where:{_id: ds.ObjectID(id)}}, function(err, photo){
            Photo.updateAll({_id: ds.ObjectID(id)}, {likeCount:photo.likeCount+1}, function (err, test) {
                cb(null, "ok");
            });
        });
    };

    Photo.remoteMethod(
        'like',
        {
            accepts: {arg: 'id', type:'string'},
            returns: {arg:'response', type:'string'},
            http: {verb: 'put', path: "/like"}
        }
    );

};
