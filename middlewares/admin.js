const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ambil token dari cookie 'auth_token'
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(403).render('403', {
      message: 'Directory Access is Forbidden. Please log in.',
      href: '/',
      title: '403 Forbidden',
      loginRedirect: true,
    });
  }

  // Verifikasi token
  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(403).render('403', {
        message: 'Invalid or expired token. Please log in again.',
        href: '/',
        title: '403 Forbidden',
        loginRedirect: true,
      });
    }

    // Simpan data pengguna yang terverifikasi ke `req.user`
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;