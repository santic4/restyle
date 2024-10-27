// estos metodos solo se usan para responder al apiRouter, asi que lo cargamos en el apiRouter.js

export function metodosPersonalizados(req, res, next) {
    res['successfullGet'] = payload => {

      res.json({
        status: 'success',
        payload
      })
    }
    res['successfullPost'] = payload => {
      res.status(201).json({
        status: 'success',
        payload
      })
    }
    res['successfullPut'] = payload => {
      res.json({
        status: 'success',
        payload
      })
    }
    res['successfullDelete'] = () => {
      res.json({
        status: 'success'
      })
    }
    next()
  }