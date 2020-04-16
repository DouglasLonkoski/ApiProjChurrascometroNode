const restify = require('restify');
const errs = require('restify-errors')

const server = restify.createServer({
    name: 'prova',
    version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '21436587',
        database: 'db'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(3003, function () {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
}));

server.get('/read', function (req, res, next) {
    knex('bbq').then((dados) => {
        res.send(dados)
    }, next)
    return next();
});

server.post('/create', function (req, res, next) {
    knex('bbq')
        .insert(req.body)
        .then((dados) => {
            res.send(dados)
        }, next)

    return next();
});

server.get('/show/:id', function (req, res, next) {
    const { id } = req.params

    knex('bbq')
        .where('id', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))

            res.send(dados)

        }, next)

    return next();
});

server.put('/update/:id', function (req, res, next) {
    const { id } = req.params

    knex('bbq')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))

            res.send('dados atualizados')

        }, next)

    return next();
});

server.del('/delete/:id', function (req, res, next) {
    const { id } = req.params

    knex('bbq')
        .where('id', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))

            res.send('dados excluidos')

        }, next)

    return next();
});

