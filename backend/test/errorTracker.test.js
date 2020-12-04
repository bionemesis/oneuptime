/* eslint-disable no-undef */

process.env.PORT = 3020;
const expect = require('chai').expect;
const userData = require('./data/user');
const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-subset'));
const app = require('../server');
const GlobalConfig = require('./utils/globalConfig');
const request = chai.request.agent(app);
const { createUser } = require('./utils/userSignUp');
const VerificationTokenModel = require('../backend/models/verificationToken');

let token, userId, projectId, componentId, errorTracker, errorEvent;
let sampleErrorEvent = {};

describe('Error Tracker API', function() {
    this.timeout(80000);

    before(function(done) {
        this.timeout(90000);
        GlobalConfig.initTestConfig().then(function() {
            createUser(request, userData.user, function(err, res) {
                const project = res.body.project;
                projectId = project._id;
                userId = res.body.id;

                VerificationTokenModel.findOne({ userId }, function(
                    err,
                    verificationToken
                ) {
                    request
                        .get(`/user/confirmation/${verificationToken.token}`)
                        .redirects(0)
                        .end(function() {
                            request
                                .post('/user/login')
                                .send({
                                    email: userData.user.email,
                                    password: userData.user.password,
                                })
                                .end(function(err, res) {
                                    token = res.body.tokens.jwtAccessToken;
                                    const authorization = `Basic ${token}`;
                                    request
                                        .post(`/component/${projectId}`)
                                        .set('Authorization', authorization)
                                        .send({
                                            name: 'New Component',
                                        })
                                        .end(function(err, res) {
                                            componentId = res.body._id;
                                            expect(res).to.have.status(200);
                                            expect(res.body.name).to.be.equal(
                                                'New Component'
                                            );
                                            done();
                                        });
                                });
                        });
                });
            });
        });
    });

    it('should reject the request of an unauthenticated user', function(done) {
        request
            .post(`/error-tracker/${projectId}/${componentId}/create`)
            .send({
                name: 'New Error Tracker',
            })
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });
    it('should reject the request of an empty error tracker name', function(done) {
        const authorization = `Basic ${token}`;
        request
            .post(`/error-tracker/${projectId}/${componentId}/create`)
            .set('Authorization', authorization)
            .send({
                name: null,
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should create an error tracker', function(done) {
        const authorization = `Basic ${token}`;
        request
            .post(`/error-tracker/${projectId}/${componentId}/create`)
            .set('Authorization', authorization)
            .send({
                name: 'Node Project',
            })
            .end(function(err, res) {
                errorTracker = res.body;
                expect(res).to.have.status(200);
                expect(res.body).to.include({ name: 'Node Project' });
                done();
            });
    });
    // it('should return a list of error trackers under component', function(done) {
    //     const authorization = `Basic ${token}`;
    //     request
    //         .get(`/error-tracker/${projectId}/${componentId}`)
    //         .set('Authorization', authorization)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(200);
    //             expect(res.body).to.be.an('array');
    //             done();
    //         });
    // });
    // it('should not return a list of error trackers under wrong component', function(done) {
    //     const authorization = `Basic ${token}`;
    //     request
    //         .get(`/error-tracker/${projectId}/5ee8d7cc8701d678901ab908`) // wrong component ID
    //         .set('Authorization', authorization)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal(
    //                 'Component does not exist.'
    //             );
    //             done();
    //         });
    // });
    // // reset api key
    // it('should reset error tracker key', function(done) {
    //     const authorization = `Basic ${token}`;
    //     const currentKey = errorTracker.key;
    //     request
    //         .post(
    //             `/error-tracker/${projectId}/${componentId}/${errorTracker._id}/reset-key`
    //         )
    //         .set('Authorization', authorization)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(200);
    //             expect(res.body._id).to.be.equal(errorTracker._id); // same error tracker id
    //             expect(res.body.key).to.not.be.equal(currentKey); // error tracker key has chaged
    //             errorTracker.key = res.body.key; // update the new key.
    //             done();
    //         });
    // });
    // // edit error tracker details
    // it('should update the current error tracker name', function(done) {
    //     const authorization = `Basic ${token}`;
    //     const appName = 'Python API App';
    //     request
    //         .put(
    //             `/error-tracker/${projectId}/${componentId}/${errorTracker._id}`
    //         )
    //         .set('Authorization', authorization)
    //         .send({ name: appName })
    //         .end(function(err, res) {
    //             expect(res).to.have.status(200);
    //             const updatedErrorTracker = res.body;
    //             expect(errorTracker._id).to.be.equal(updatedErrorTracker._id); // same id
    //             expect(errorTracker.key).to.be.equal(updatedErrorTracker.key); // same key
    //             expect(updatedErrorTracker.name).to.be.equal(appName); // change of name
    //             errorTracker = updatedErrorTracker; // update the error track
    //             done();
    //         });
    // });
    // should request for missing fields an error Event
    // it('should request for eventId for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal('Event ID is required.');
    //             done();
    //         });
    // });
    // it('should request for fingerprint for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal(
    //                 'Fingerprint is required.'
    //             );
    //             done();
    //         });
    // });
    // it('should request for fingerprint as an array for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     sampleErrorEvent.fingerprint = 'fingerprint';
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal(
    //                 'Fingerprint is to be of type Array.'
    //             );
    //             done();
    //         });
    // });
    // it('should request for error event type for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     sampleErrorEvent.fingerprint = ['fingerprint'];
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal(
    //                 'Error Event Type must be of the allowed types'
    //             );
    //             done();
    //         });
    // });
    // it('should request for tags for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     sampleErrorEvent.fingerprint = ['fingerprint'];
    //     sampleErrorEvent.type = 'exception';
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal('Tags is required.');
    //             done();
    //         });
    // });
    // it('should request for timeline in array format for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     sampleErrorEvent.fingerprint = ['fingerprint'];
    //     sampleErrorEvent.type = 'exception';
    //     sampleErrorEvent.tags = [];
    //     sampleErrorEvent.timeline = 'done';
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal(
    //                 'Timeline is to be of type Array.'
    //             );
    //             done();
    //         });
    // });
    // it('should request for exception for tracking an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     sampleErrorEvent.fingerprint = ['fingerprint'];
    //     sampleErrorEvent.type = 'exception';
    //     sampleErrorEvent.timeline = [];
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal('Exception is required.');
    //             done();
    //         });
    // });
    // it('should declare Error Tracker not existing for an error event', function(done) {
    //     const authorization = `Basic ${token}`;
    //     sampleErrorEvent.eventId = 'samplId';
    //     sampleErrorEvent.fingerprint = ['fingerprint'];
    //     sampleErrorEvent.type = 'exception';
    //     sampleErrorEvent.timeline = [];
    //     sampleErrorEvent.tags = [];
    //     sampleErrorEvent.exception = {};
    //     request
    //         .post(`/error-tracker/${errorTracker._id}/track`)
    //         .set('Authorization', authorization)
    //         .send(sampleErrorEvent)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(400);
    //             expect(res.body.message).to.be.equal(
    //                 'Error Tracker does not exist.'
    //             );
    //             done();
    //         });
    // });
    it('should create an error event and set a fingerprint hash and issueId', function(done) {
        const authorization = `Basic ${token}`;
        sampleErrorEvent.eventId = 'samplId';
        sampleErrorEvent.fingerprint = ['fingerprint'];
        sampleErrorEvent.type = 'exception';
        sampleErrorEvent.timeline = [];
        sampleErrorEvent.tags = [];
        sampleErrorEvent.exception = {};
        sampleErrorEvent.errorTrackerKey = errorTracker.key;
        request
            .post(`/error-tracker/${errorTracker._id}/track`)
            .set('Authorization', authorization)
            .send(sampleErrorEvent)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                errorEvent = res.body;
                expect(errorEvent.type).to.be.equal(sampleErrorEvent.type);
                expect(errorEvent).to.have.property('fingerprintHash');
                expect(errorEvent).to.have.property('issueId');
                expect(errorEvent.errorTrackerId).to.be.equal(errorTracker._id);
                done();
            });
    });
    // delete error tracker
    // it('should delete the error tracker', function(done) {
    //     const authorization = `Basic ${token}`;
    //     request
    //         .delete(
    //             `/error-tracker/${projectId}/${componentId}/${errorTracker._id}`
    //         )
    //         .set('Authorization', authorization)
    //         .end(function(err, res) {
    //             expect(res).to.have.status(200);
    //             expect(res.body.deleted).to.be.equal(true);
    //             done();
    //         });
    // });
});
