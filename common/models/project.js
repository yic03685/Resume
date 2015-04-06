var RSVP = require("rsvp");
Object.assign = require("object-assign");

module.exports = function(Project) {

    var ObjectId;

    function merge (xs, ys, key){
        return xs.map(function(x, i){
            var obj = {};
            obj[key] = ys[i];
            return Object.assign({}, x.__data, obj);
        });
    }

    function getAllProject(models) {
        return new RSVP.Promise(function (resolve, reject) {
            models.ProjectItem.find(function (err, workItems) {
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
            models.Achievement.find({where: {projectId: workItemId}}, function (err, achievements) {
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

    Project.gather = function (cb) {
        var models = Project.app.models;
        ObjectId = Project.app.dataSources.mongodb.ObjectID;
        getAllProject(models).then(function(res){
            cb(null, res);
        });

    };

    Project.remoteMethod(
        'gather',
        {
            returns: {arg: 'project', type: 'object'},
            http: {verb: 'get', path: "/"}
        }
    );

};
