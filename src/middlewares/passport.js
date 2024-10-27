import passport from 'passport'

export const passportLogin= passport.authenticate('localLogin', {
    failWithError: true,
    session: false
   
})


export const passportAuth= passport.authenticate('jwtAuth', {
    failWithError: true,
    session: false,
})

export const sessionAuth= passport.authenticate('jwtAuth', {
    session: false
})