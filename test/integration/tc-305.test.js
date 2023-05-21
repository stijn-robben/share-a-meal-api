const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');
const pool = require('../../src/util/mysql-db');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Tests for: UC-305', function () {
    it('TC-305-1', (done) => {
        chai.request(app)
            .delete('/api/meal/9999')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Not authorized');
                done();
            });
    });

    it('TC-305-2', (done) => {
        chai.request(app)
            .delete('/api/meal/3')
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Not authorized');
                done();
            });
    });

    it('TC-305-3', (done) => {
        chai.request(app)
        .delete('/api/meal/9999')
        .set('authorization', 'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey))
        .end((err, res) => {
            expect(res.body.status).to.equal(401);
            expect(res.body.message).to.equal('Not authorized');
            done();
        });
    });
});
