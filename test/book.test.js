// const expect = require('chai').expect;
// const db = require('../models');

// before(function (done) {
//     db.sequelize.sync({ force: true }).then(function () {
//         done();
//     });
// });

// describe('Book Model', function () {
//     let user;

//     before(function (done) {
//         db.user.create({
//             email: 'test@test.co',
//             name: 'Muttbuncher',
//             password: 'password'
//         }).then(function (newUser) {
//             user = newUser;
//             done();
//         }).catch(function (error) {
//             done(error);
//         });
//     });

//     it('should create a book successfully', function (done) {
//         db.book.create({
//             title: 'Book 1',
//             author: 'Author 1',
//             isbn: '978-0394800011',
//             userId: user.id
//         }).then(function () {
//             done();
//         }).catch(function (error) {
//             done(error);
//         });
//     });


//     it('should throw an error if title is not provided', function (done) {
//         db.book.create({
//             author: 'Author 2',
//             userId: user.id
//         }).then(function () {
//             done(new Error('Expected an error to be thrown.'));
//         }).catch(function () {
//             done();
//         });
//     });

//     it('should throw an error if author is not provided', function (done) {
//         db.book.create({
//             title: 'Book 2',
//             userId: user.id
//         }).then(function () {
//             done(new Error('Expected an error to be thrown.'));
//         }).catch(function () {
//             done();
//         });
//     });

//     it('should throw an error if userId is not provided', function (done) {
//         db.book.create({
//             title: 'Book 3',
//             author: 'Author 3'
//         }).then(function () {
//             done(new Error('Expected an error to be thrown.'));
//         }).catch(function () {
//             done();
//         });
//     });

//     it('should associate a book with a user', function (done) {
//         db.book.findOne({
//             where: {
//                 userId: user.id,
//                 isbn: '978-0394800011'
//             }
//         }).then(function (book) {
//             expect(book).to.exist;
//             expect(book.userId).to.equal(user.id);
//             done();
//         }).catch(function (error) {
//             done(error);
//         });
//     });
// });
