const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-304', function () {
    it('TC-304-1', (done) => {
        const mealId = -1;
        chai.request(app)
            .get(`/api/meal/${mealId}`)
            .end((err, res) => {
                expect(res.body.status).to.equal(404);
                expect(res.body.message).to.equal(`Meal met id ${mealId} kan niet gevonden worden...`);
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-304-2: meal id exists', (done) => {
        const mealId = 2;
        
        chai.request(app)
            .get(`/api/meal/${mealId}`)
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal(`Meal met id ${mealId} is gevonden`);
                expect(res.body.data).to.be.an('object').that.is.not.empty;
                expect(res.body.data).to.have.property('id').to.equal(mealId);
                done();
            });
    });

    
});
