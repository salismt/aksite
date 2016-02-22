'use strict';

var _ = require('lodash'),
    util = require('../../util'),
    Post = require('./post.model'),
    auth = require('../../auth/auth.service'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    gridform = require('gridform'),
    conn = mongoose.createConnection(config.mongo.uri);

conn.once('open', function(err) {
    if(err) console.log(err);
    else gridform.db = conn.db;
});

const DEFAULT_PAGESIZE = 10,
    MIN_PAGESIZE = 5,
    MAX_PAGESIZE = 25;

// Get list of posts
exports.index = function(req, res) {
    if(req.query.page && req.query.page < 1) return res.status(400).send('Invalid page');

    var pageSize = (req.query.pagesize && req.query.pagesize <= MAX_PAGESIZE && req.query.pagesize > MIN_PAGESIZE) ? req.query.pagesize : DEFAULT_PAGESIZE;
    var page = parseInt(req.query.page) || 0;

    Post.count({}, function(err, count) {
        if(err) return util.handleError(res, err);

        let query;
        if(!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin'))
            query = Post.find({ hidden: false });
        else
            query = Post.find();

        query
            .limit(pageSize)
            .sort('date')
            .skip((req.query.page-1) * pageSize || 0)//doesn't scale well, I'll worry about it later
            .exec(function(err, posts) {
                if(err) return util.handleError(res, err);

                return res.status(200).json({
                    page: page,
                    pages: Math.ceil(count / pageSize),
                    items: posts,
                    numItems: count
                });
            });
    });
};

// Get a single post
exports.show = function(req, res) {
    if(!util.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid ID');
    Post.findById(req.params.id, function(err, post) {
        if(err) return util.handleError(res, err);
        if(!post) return res.status(404).end();

        if( (!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) && post.hidden )
            return res.status(401).end();

        res.json(post);
    });
};

// Get the number of posts
exports.count = function(req, res) {
    Post.count({}, function(err, count) {
        if(err) util.handleError(res, err);
        else res.status(200).json(count);
    });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
    if(config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin'))
        return res.status(401).send('You need to be an admin to create posts');

    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    // optionally store per-file metadata
    //form.on('fileBegin', function(name, file) {
    //    file.metadata = {};
    //});

    form.parse(req, function(err, fields, files) {
        if(err) return util.handleError(res, err);

        /**
         * file.name            - the uploaded file name
         * file.type            - file type per [mime](https://github.com/bentomas/node-mime)
         * file.size            - uploaded file size (file length in GridFS) named "size" for compatibility
         * file.path            - same as file.name. included for compatibility
         * file.lastModified    - included for compatibility
         * file.root            - the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
         * file.id              - the ObjectId for this file
         * @type {file}
         */
        var file = files.file;

        //console.log(file);
        //console.log(fields);

        var postModel = _.pick(fields, ['title', 'subheader', 'alias', 'content']);

        postModel.date = !_.isEmpty(fields.date) ? new Date(fields.date) : new Date();
        postModel.author = {
            name: fields['author[name]'],
            id: fields['author[id]'],
            imageId: fields['author[imageId]'],
            smallImageId: fields['author[smallImageId]']
        };
        postModel.hidden = !_.isEmpty(fields.hidden) ? !!JSON.parse(fields.hidden) : false;
        postModel.categories = !_.isEmpty(fields.categories) ? JSON.parse(fields.categories) : [];

        if(file) {
            postModel.imageId = file.id;

            util.createThumbnail(file.id)
                .then(thumbnail => {
                    console.log(thumbnail.filename + ' -> (thumb)' + thumbnail.id);
                    postModel.thumbnailId = thumbnail.id;

                    Post.create(postModel, function(err, post) {
                        if(err) return util.handleError(res, err);
                        res.status(201).json(post);
                    });
                });
        } else {
            Post.create(postModel, function(err, post) {
                if(err) return util.handleError(res, err);
                else return res.status(201).json(post);
            });
        }
    });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
    if(config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin'))
        return res.status(401).send('You need to be an admin to create posts');
    if(!util.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid ID');

    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    Post.findById(req.params.id, function(err, post) {
        if(err) return util.handleError(res, err);
        else if(!post) return res.status(404).end();

        form.parse(req, function(err, fields, files) {
            if(err) return util.handleError(res, err);

            if(fields._id)
                delete fields._id;

            /**
             * file.name            - the uploaded file name
             * file.type            - file type per [mime](https://github.com/bentomas/node-mime)
             * file.size            - uploaded file size (file length in GridFS) named "size" for compatibility
             * file.path            - same as file.name. included for compatibility
             * file.lastModified    - included for compatibility
             * file.root            - the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
             * file.id              - the ObjectId for this file
             * @type {file}
             */
            var file = files.file;

            if(fields.newImage && (_.isNull(file) || _.isUndefined(file)))
                return res.status(400).send(new Error('No file'));

            console.log(file);
            console.log(fields);
            var postModel = _.pick(fields, ['title', 'subheader', 'alias', 'content', 'date']);
            if(!_.isEmpty(fields.hidden)) postModel.hidden = !!JSON.parse(fields.hidden);
            if(!_.isEmpty(fields.categories)) postModel.categories = JSON.parse(fields.categories);

            if(fields.newImage) {
                if(post.imageId) {
                    util.deleteFile(post.imageId)
                        .catch(util.handleError)
                        .then(_.partial(console.log('deleted imageId')));
                    util.deleteFile(post.thumbnailId)
                        .catch(util.handleError)
                        .then(_.partial(console.log('deleted thumbnailId')));
                }

                postModel.imageId = file.id;

                util.createThumbnail(file.id)
                    .then(thumbnail => {
                        console.log(thumbnail.filename + ' -> (thumb)' + thumbnail.id);
                        postModel.thumbnailId = thumbnail.id;

                        var updated = _.assign(post, postModel);
                        return updated.save(function(err) {
                            if(err) return util.handleError(res, err);
                            res.status(200).json(post);
                        });
                    });
            } else {
                console.log(post);
                console.log(postModel);
                var updated = _.assign(post, postModel);
                console.log(updated);
                return updated.save(function(err) {
                    if(err) return util.handleError(res, err);
                    res.status(200).json(post);
                });
            }
        });
    });
};

// Deletes a post from the DB.
exports.destroy = function(req, res) {
    if(!util.isValidObjectId(req.params.id)) return res.status(400).send('Invalid ID');

    Post.findById(req.params.id, function(err, post) {
        if(err) return util.handleError(res, err);
        if(!post) return res.send(404);

        post.remove((err) => {
            if(err) return util.handleError(res, err);
            return res.send(204);
        });
    });
};
