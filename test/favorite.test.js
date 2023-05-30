const { expect } = require('chai');
const db = require('../models');

describe('Favorite Model', function () {
    let user;
    let book;

    before(async function () {
        await db.sequelize.sync({ force: true });
        user = await db.user.create({
            email: 'test@test.co',
            name: 'Muttbuncher',
            password: 'password'
        });
        book = await db.book.create({
            title: 'Book 1',
            author: 'Author 1',
            description: 'Description 1',
            category: 'Category 1',
            isbn: '978-0394800011',
            userId: user.id
        });
    });

    it('should create a favorite successfully', async function () {
        const favorite = await db.favorite.create({
            userId: user.id,
            bookId: book.id
        });
        expect(favorite).to.exist;
        expect(favorite.userId).to.equal(user.id);
        expect(favorite.bookId).to.equal(book.id);
    });

    it('should throw an error if userId is not provided', async function () {
        try {
            await db.favorite.create({
                bookId: book.id
            });
            throw new Error('Expected an error to be thrown.');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.equal('notNull Violation: favorite.userId cannot be null');
        }
    });

    it('should throw an error if bookId is not provided', async function () {
        try {
            await db.favorite.create({
                userId: user.id
            });
            throw new Error('Expected an error to be thrown.');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.equal('notNull Violation: favorite.bookId cannot be null');
        }
    });

    it('should associate a favorite with a user', async function () {
        const favorite = await db.favorite.findOne({
            where: {
                userId: user.id
            }
        });
        expect(favorite).to.exist;
        expect(favorite.userId).to.equal(user.id);
    });

    it('should associate a favorite with a book', async function () {
        const favorite = await db.favorite.findOne({
            where: {
                bookId: book.id
            }
        });
        expect(favorite).to.exist;
        expect(favorite.bookId).to.equal(book.id);
    });
});
