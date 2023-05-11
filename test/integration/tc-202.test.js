const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-202', function () {
    it('TC-202-1', (done) => {
        chai.request(app)
            .get('/api/user')
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal('User getAll endpoint');
                expect(res.body.data).that.is.an('array').with.length.gte(2);
                done();
            });
    });

    it('TC-202-2', (done) => {
        chai.request(app)
        .get('/api/user/')
        .end((err, res) => {
            expect(res.body.status).to.equal(200);
            expect(res.body.message).to.equal('User getAll endpoint');
            expect(res.body.data).that.is.an('array').with.length.gte(2);
            done();
        });
    });

    it('TC-202-3', (done) => {
        chai.request(app)
            //iedereen heeft een id dus dit geeft niks terug
            .get('/api/user?id=')
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal('User getAll endpoint');
                expect(res.body.data).that.is.an('array');
                expect(res.body.data).to.have.lengthOf(0);
                done();
            });
    });

    it('TC-202-4', (done) => {
        chai.request(app)
            .get('/api/user?isActive=true')
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal('User getAll endpoint');
                expect(res.body.data).that.is.an('array');
                res.body.data.forEach((user) => {
                    expect(user.isActive).to.be.equal(1);
                });
                done();
            });
    });
});
