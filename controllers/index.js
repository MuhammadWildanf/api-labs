class Controller {
    static home(req, res, next) {
        try {
            res.send('API LAB');
        } catch (error) {
            next(err);
        }
    }
}

module.exports = Controller;
