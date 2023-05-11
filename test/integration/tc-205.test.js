const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');

const logger = require('../../src/util/utils').logger;
const pool = require('../../src/util/mysql-db');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Tests for: UC-205', function () {
    it('TC-205-1', (done) => {
        chai.request(app)
            .put('/api/user/1')
            .send({ emailAddress: 'fouteemail'})
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('Invalid emailAddress');
                done();
            });
    });

    it('TC-205-2', (done) => {
        //afmaken wanneer tokens zijn geimplementeerd
         done();
    });

    it('TC-205-3', (done) => {
        chai.request(app)
            .put('/api/user/1')
            .send({ emailAddress: 'user@example.com', phoneNumber: 'foutetelefoonnummer' })
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('Invalid phoneNumber');
                done();
            });
    });

    it('TC-205-4', (done) => {
        chai.request(app)
            .put('/api/user/-1')
            .send({ emailAddress: 'user@example.com', phoneNumber: '+14155552671' })
            .end((err, res) => {
                expect(res.body.status).to.equal(404);
                expect(res.body.message).to.equal('User met id -1 kan niet gevonden worden');
                done();
            });
    });

    it('TC-205-5', (done) => {
        //afmaken wanneer tokens zijn geimplementeerd
         done();
    });

    it('TC-205-6', (done) => {
        //nog doen
                            
                        
        done();     
                
            
        
    });
});
