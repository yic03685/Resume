var RSVP = require("rsvp");
Object.assign = require("object-assign");

module.exports = function (Work) {

    var ObjectId;

    function merge (xs, ys, key){
        return xs.map(function(x, i){
            var obj = {};
            obj[key] = ys[i];
            return Object.assign({}, x.__data, obj);
        });
    }

    function getAllWork(models) {
        return new RSVP.Promise(function (resolve, reject) {
            models.WorkItem.find(function (err, workItems) {
                RSVP.all(workItems
                    .map( function(workItem){
                        return getAllAchievements(models, ObjectId(workItem.id));
                    }))
                    .then(function(achievements){
                        resolve(merge(workItems, achievements, "achievements"));
                    });
            });
        });
    }

    function getAllAchievements(models, workItemId) {
        return new RSVP.Promise(function (resolve, reject) {
            models.Achievement.find({where: {workId: workItemId}}, function (err, achievements) {
                RSVP.all(achievements
                    .map( function(achievement){
                      return getAllPhotos(models, achievement.id);
                    }))
                    .then(function(photos){
                        resolve(merge(achievements, photos, "photos"));
                    });
            });
        });
    }

    /**
     *
     * @param models
     * @param achievementId
     * @returns {[]}
     */
    function getAllPhotos(models, achievementId) {
        return new RSVP.Promise(function (resolve, reject) {
            models.Photo.find({where: {achievementId: achievementId}}, function (err, photos) {
                resolve(photos);
            });
        });
    }

    Work.gather = function (cb) {
        var models = Work.app.models;
        ObjectId = Work.app.dataSources.mongodb.ObjectID;
        getAllWork(models).then(function(res){
            cb(null, res);
        });

    };

    Work.remoteMethod(
        'gather',
        {
            returns: {arg: 'work', type: 'object'},
            http: {verb: 'get', path: "/"}
        }
    );

};
