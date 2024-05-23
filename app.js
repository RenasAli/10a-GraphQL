import { ApolloServer } from 'apollo-server'
import fs from 'fs';
import path from 'path';
import resolvers from './resolvers.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = 4040;

server.listen(PORT).then(({ url }) => {
    console.log(`Use the server at ${url}`);
});
