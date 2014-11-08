'use strict';

var _ = require('lodash');
var Project = require('./project.model');

// Get list of projects
exports.index = function(req, res) {
    Project.find(function(err, projects) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(200).json(projects);
        }
    });
};

// Get a single project
exports.show = function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        if(err) {
            return handleError(res, err);
        }
        if(!project) {
            return res.send(404);
        }
        return res.json(project);
    });
};

// Creates a new project in the DB.
exports.create = function(req, res) {
    var sanitized = sanitiseNewGallery(req.body, req.params);
    if(sanitized !== null) {
        return res.status(400).send(sanitized);
    } else {
        var newProject = {
            name: req.body.name,
            info: req.body.info,
            thumbnailId: req.body.thumbnailId,
            coverId: req.body.coverId,
            link: req.body.link,
            date: req.body.date || new Date(),
            active: req.body.active || true
        };
        return Project.create(newProject, function(err, project) {
            if(err) {
                return handleError(res, err);
            } else {
                return res.status(201).json(project);
            }
        });
    }
};

// Updates an existing project in the DB.
exports.update = function(req, res) {
    if(req.body._id) {
        delete req.body._id;
    }
    Project.findById(req.params.id, function(err, project) {
        if(err) {
            return handleError(res, err);
        } else if(!project) {
            return res.send(404);
        } else {
            var updated = _.merge(project, req.body);
            return updated.save(function(err) {
                if(err) {
                    return handleError(res, err);
                }
                return res.status(200).json(project);
            });
        }
    });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        if(err) {
            return handleError(res, err);
        }
        if(!project) {
            return res.send(404);
        }
        project.remove(function(err) {
            if(err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}

function sanitiseNewGallery(body, params) {
    // Required Params
    if(!body.name) {
        return 'Missing Name'
    } else if(!body.info) {
        return 'Missing info';
    } else if(!body.thumbnailId) {
        return 'No thumbnail given';
    } else if(!body.coverId) {
        return 'No cover photo given';
    } else if(!body.link) {
        return 'No link given';
    }
    // Type Checking
    else if(typeof body.name !== 'string') {
        return 'Name not String';
    } else if(typeof body.info !== 'string') {
        return 'Info not String';
    } else if(typeof body.link !== 'string') {
        return 'Link not String';
    } else if(body.date instanceof Date && !isNaN(body.date.valueOf())) {
        return 'Date not of type Date';
    } else if(body.active && typeof body.active !== 'boolean') {
        return 'Active not Boolean';
    } else {
        return null;
    }
}
