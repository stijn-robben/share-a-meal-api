const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');

const pool = require('../../src/util/mysql-db');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-303', function () {
    it('TC-303-1', (done) => {
        chai.request(app)
        .get('/api/meal/')
        .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
        .end((err, res) => {
            expect(res.body.status).to.equal(200);
            expect(res.body.message).to.equal('Meal getAll endpoint');
            expect(res.body.data).that.is.an('array');
            done();
        });
        });
    });

