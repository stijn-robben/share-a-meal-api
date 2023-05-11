const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');

const logger = require('../../src/util/utils').logger;
const pool = require('../../src/util/mysql-db');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Tests for: UC-206', function () {
    it('TC-206-1: user does not exist', (done) => {
        chai.request(app)
            .delete('/api/user/-1')
            .end((err, res) => {
                expect(res.body.status).to.equal(404);
                expect(res.body.message).to.equal('User not found');
                done();
            });
    });

    it('TC-206-2: user is not logged in', (done) => {
        //afmaken wanneer tokens zijn geimplementeerd
         done();
    });

    it('TC-206-3: user is not the owner of the data', (done) => {
        //afmaken wanneer tokens zijn geimplementeerd
         done();
    });

    it('TC-206-4: user deleted successfully', (done) => {
        const user = {
            firstName: "test",
            lastName: "test",
            emailAddress: "test@test.nl",
            street: "Hogeschoollaan",
            city: "Tilburg",
            password: "Wachtwoord123",
            phoneNumber: "06942126952",
            isActive : 1,
        };

        const deleteQuery = 'DELETE FROM user WHERE emailAdress = ?';
        const deleteValues = [user.emailAddress];

        const insertQuery =
            'INSERT INTO user (firstName, lastName, emailAdress, password, street, city, phoneNumber, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [user.firstName, user.lastName, user.emailAddress, user.password, user.street, user.city, user.phoneNumber, user.isActive];

        pool.getConnection((err, conn) => {
            if (err) {
                done(err);
            } else {
                conn.query(deleteQuery, deleteValues, (err, results) => {
                    if (err) {
                        done(err);
                    } else {
                        conn.query(insertQuery, insertValues, (err, results) => {
                            if (err) {
                                done(err);
                            } else {
                                const userId = results.insertId;
                                chai.request(app)
                                    .delete(`/api/user/${userId}`)
                                    .end((err, res) => {
                                        expect(res.body.status).to.equal(200);
                                        expect(res.body.message).to.equal(
                                            `User met id ${userId} is verwijderd`
                                        );
                                    });
                            }
                        });
                    }
                });
            }
        });
    });
});
