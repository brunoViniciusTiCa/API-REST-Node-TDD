const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  const protectedRouter = express.Router();

  
  protectedRouter.use('/users',  app.routes.users);
  protectedRouter.use('/accounts',  app.routes.accounts);
  protectedRouter.use('/transactions', app.routes.transactions);

  /**v1 = versão 1 Na rota V1 todas as middlewares estão protegidas com o JWT, Token e autenticadas. 
   * Desta nova forma criei um arquivo, de router e nele coloquei uma lógica onde pode ser feito o caminho
   * alterando e assim deixando cada rota tendo autonomia.  
   */
  app.use('/v1', app.config.passport.authenticate(), protectedRouter);

  /** Segunda rota não esta protegida e foi apenas para testar que desta forma de criar nossas
   * rotas, temos mais autonomia sobre nosso codigo e também podemos herdar e assim o codigo 
   * ficará menor e legivel.
   */
  app.get('/v2/users', (req, res) => res.status(200).send('V2 esta rodando na segunda rota sem está protegida.'));
  app.use('/v2', protectedRouter);
};
