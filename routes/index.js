const loginRouter = require('./login')
const userRouter = require('./user')
function route(app){
    app.use('/', loginRouter)
    app.use('/user', userRouter)
}
module.exports = route;