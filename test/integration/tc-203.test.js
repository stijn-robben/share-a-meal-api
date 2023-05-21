const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-203', function () {
    it('TC-203-1', (done) => {
        chai.request(app)
            .get('/api/user/profile')
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Authorization header missing!');
                done();
            });
    });
    
    it('TC-203-2', (done) => {
        chai.request(app)
            .get('/api/user/profile')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.contain('is gevonden!');
                expect(res.body.data).to.be.an('array')
                done();
            });
    });


    
});
