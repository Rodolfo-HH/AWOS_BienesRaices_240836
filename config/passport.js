import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import Usuario from "../models/Usuario.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {

    const email = profile.emails[0].value;

    let usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        usuario = await Usuario.create({
            nombre: profile.displayName,
            email,
            password: null,
            confirmado: true,
            google: true
        });
    }

    return done(null, usuario);
}));

// Guardar sesión
passport.serializeUser((usuario, done) => done(null, usuario.id));

// Leer sesión
passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario);
});