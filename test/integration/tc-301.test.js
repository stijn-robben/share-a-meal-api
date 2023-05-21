const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');

const pool = require('../../src/util/mysql-db');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-301', function () {
    it('TC-301-1', (done) => {
        const meal = {
            name: "Pizza",
            description: "Pizza met ananas",
            isActive: 1,
            isVega: 1,
            isVegan: 1,
            isToTakeHome: 1,
            dateTime: "2022-03-22 17:35:00",
            price: 10.75,
            imageUrl: "https://imageurl.com",
            allergenes: "noten"
          };

        chai.request(app)
            .post('/api/meal')
            .send(meal)
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.contain('is missing');
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-301-2', (done) => {
        const meal = {
            name: "Pizza",
            description: "Pizza met ananas",
            isActive: 1,
            isVega: 1,
            isVegan: 1,
            isToTakeHome: 1,
            dateTime: "2022-03-22 17:35:00",
            price: 10.75,
            imageUrl: "https://imageurl.com",
            allergenes: "noten",
            maxAmountOfParticipants: 20
          };

        chai.request(app)
            .post('/api/meal')
            .send(meal)
            .end((err, res) => {
                expect(res.body.status).to.equal(401);
                expect(res.body.message).to.equal('Authorization header missing!');
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-301-3', (done) => {
        const meal = {
            name: "Pizza",
            description: "Pizza met ananas",
            isActive: 1,
            isVega: 1,
            isVegan: 1,
            isToTakeHome: 1,
            dateTime: "2022-03-22 17:35:00",
            price: 10.75,
            imageUrl: "https://imageurl.com",
            allergenes: "noten",
            maxAmountOfParticipants: 20
          };

        chai.request(app)
            .post('/api/meal')
            .send(meal)
            .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.contain('is toegevoegd');
                expect(res.body.data).to.be.an('object');
                done();
            });
    });

    
    });

