import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub();
const BOOK_ADDED = 'BOOK_ADDED';

const authors = [
    { id: '1', name: 'J.K. Rowling' },
    { id: '2', name: 'J.R.R. Tolkien' },
    { id: '3', name: 'George R.R. Martin' }
];

const books = [
    { id: '1', title: 'Harry Potter and the Sorcerer\'s Stone', releaseYear: 1997, authorId: '1' },
    { id: '2', title: 'Harry Potter and the Chamber of Secrets', releaseYear: 1998, authorId: '1' },
    { id: '3', title: 'The Hobbit', releaseYear: 1937, authorId: '2' },
    { id: '4', title: 'The Lord of the Rings: The Fellowship of the Ring', releaseYear: 1954, authorId: '2' },
    { id: '5', title: 'A Game of Thrones', releaseYear: 1996, authorId: '3' },
    { id: '6', title: 'A Clash of Kings', releaseYear: 1998, authorId: '3' }
];

const resolvers = {
    Query: {
        books: () => books,
        book: (_, { id }) => books.find(book => book.id === id),
        authors: () => authors,
        author: (_, { id }) => authors.find(author => author.id === id),
    },
    Mutation: {
        createBook: (_, { authorId, title, releaseYear }) => {
            const newBook = { id: String(books.length + 1), authorId, title, releaseYear };
            books.push(newBook);
            pubsub.publish(BOOK_ADDED, { bookAdded: newBook });
            return newBook;
        },
        updateBook: (_, { id, authorId, title, releaseYear }) => {
            const book = books.find(book => book.id === id);
            if (!book) throw new Error("Book not found");

            if (authorId !== undefined) book.authorId = authorId;
            if (title !== undefined) book.title = title;
            if (releaseYear !== undefined) book.releaseYear = releaseYear;

            return book;
        },
        deleteBook: (_, { id }) => {
            const bookIndex = books.findIndex(book => book.id === id);
            if (bookIndex === -1) throw new Error("Book not found");
            books.splice(bookIndex, 1);
            return { message: "Book deleted successfully" };
        }
    },
    Book: {
        author: (book) => authors.find(author => author.id === book.authorId)
    },
    Author: {
        books: (author) => books.filter(book => book.authorId === author.id)
    }
};

export default resolvers