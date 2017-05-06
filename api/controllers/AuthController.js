/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, {err: 'Email and password required'});
    }

    User.findOne({email: email}, function (err, user) {
      if (!user) {
        return res.json(401, {err: 'Invalid email or password'});
      }

      User.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, {err: 'Forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'Invalid email or password'});
        } else {
          res.json({
            user: user,
            token: jwToken.issue({id : user.id })
          });
        }
      });
    })
  }
};
