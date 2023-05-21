const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-204', function () {
    it('TC-204-1', (done) => {
        chai.request(app)
            .get('/api/user/1')
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Authorization header missing!');
                done();
            });
    });

    it('TC-204-2', (done) => {
        const userId = -1;
        chai.request(app)
            .get(`/api/user/${userId}`)
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(404);
                expect(res.body.message).to.equal(`Gebruiker met id ${userId} kan niet gevonden worden...`);
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-204-3: user id exists', (done) => {
        const userId = 1;
        
        chai.request(app)
            .get(`/api/user/${userId}`)
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal(`Gebruiker met id ${userId} is gevonden`);
                expect(res.body.data).to.be.an('object').that.is.not.empty;
                expect(res.body.data).to.have.property('id').to.equal(userId);
                done();
            });
    });

    
});
