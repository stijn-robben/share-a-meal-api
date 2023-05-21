const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Tests for: UC-205', function () {
    it('TC-205-1', (done) => {
        chai.request(app)
            .put('/api/user/1')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({ emailAdress: 'fouteemail'})
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('Invalid emailAdress');
                done();
            });
    });

    it('TC-205-2', (done) => {
        chai.request(app)
            .put('/api/user/2')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({ emailAdress: 'test@email.com'})
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Not authorized');
                done();
            });
    });

    it('TC-205-3', (done) => {
        chai.request(app)
            .put('/api/user/1')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({ emailAddress: 'user@example.com', phoneNumber: 'fouttelefoonnummer' })
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('Invalid phoneNumber');
                done();
            });
    });

    it('TC-205-4', (done) => {
        chai.request(app)
            .put('/api/user/-1')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: -1 }, jwtSecretKey))
            .send({ emailAddress: 'user@example.com', phoneNumber: '+14155552671' })
            .end((err, res) => {
                expect(res.body.status).to.equal(404);
                expect(res.body.message).to.equal('User met id -1 kan niet gevonden worden');
                done();
            });
    });


    it('TC-205-5', (done) => {
        chai.request(app)
            .put('/api/user/1')
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Authorization header missing!');
                done();
            });
    });

    it('TC-205-6', (done) => {
        //afmaken wanneer tokens zijn geimplementeerd
        chai.request(app)
        .put('/api/user/1')
        .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
        .send({
            id: 1
        })
        .end((err, res) => {
            expect(res.body.status).to.equal(200);
            expect(res.body.message).to.contain('is aangepast');
            expect(res.body.data).that.is.an('object');
            done();
        })
    });
});