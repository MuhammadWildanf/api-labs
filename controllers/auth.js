const { User } = require('../models/index')
const { hash, compareHash } = require('../helpers/hash');
const { createToken } = require('../helpers/token');
const { OAuth2Client } = require('google-auth-library')


class Auth {

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw { name: "Unauthorized", message: "Email & Password required !" }
            }

            let user = await User.findOne({ where: { email: email } })

            if (!user || !compareHash(password, user.password)) {
                throw { name: "Unauthorized", message: "Invalid email or password !" }
            }

            let access_token = createToken({ id: user.id })
            res.status(200).json({ id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, profile: user.profile, email: user.email, role: user.role, access_token })
        } catch (error) {
            console.log(error);
            next(error.message)
        }
    }

    static async google(req, res, next) {
        try {
            const { google_token } = req.headers

            const client = new OAuth2Client()
            const ticket = await client.verifyIdToken({ idToken: google_token, audience: process.env.GOOGLE_CLIENT_ID })
            const payload = ticket.getPayload()

            let user = await User.findOne({ where: { email: payload.email } })

            if (!user) {
                user = await User.create({
                    username: payload.name,
                    email: payload.email,
                    password: "Oauth2" + Date.now(),
                    role: "staff",
                    phoneNumber: "08696969696699",
                    address: "-",
                })
            }

            const access_token = createToken({ id: user.id, email: user.email, role: user.role })

            res.status(200).json({ id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, profile: user.profile, email: user.email, role: user.role, access_token })
        } catch (err) {
            next(err)
        }
    }

    static async editProfile(req, res, next) {
        try {
            const userId = req.user.id; // ini didapat dari middleware authentication
            const { username, firstname, lastname, email, password } = req.body;

            const user = await User.findByPk(userId);

            if (!user) {
                throw { name: "NotFound", message: "User not found" };
            }

            // Update hanya field yang diisi
            if (username) user.username = username;
            if (firstname) user.firstname = firstname;
            if (lastname) user.lastname = lastname;
            if (email) user.email = email;
            if (password) user.password = hash(password); // pastikan hash password baru

            await user.save();

            res.status(200).json({
                message: "Profile updated successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                }
            });
        } catch (err) {
            console.log(error);
            next(error);
        }
    }

    static async editProfileWithImage(req, res, next) {
        try {
            const userId = req.user.id;
            const { username, firstname, lastname, email, password } = req.body;
            const file = req.file;

            const user = await User.findByPk(userId);
            if (!user) {
                throw { name: "NotFound", message: "User not found" };
            }

            if (username) user.username = username;
            if (firstname) user.firstname = firstname;
            if (lastname) user.lastname = lastname;
            if (email) user.email = email;
            if (password) user.password = hash(password);
            if (file) user.profile = file.path; // path ke file yang diupload

            await user.save();

            res.status(200).json({
                message: "Profile updated with image",
                user: {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    profile: user.profile,
                    role: user.role
                }
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = Auth