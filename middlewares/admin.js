const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ambil token dari cookie 'auth_token'
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(403).render('403', {
      message: 'Akses ini hanya milik admin, silahkan login',
      href: '/',
      title: '403 Forbidden',
      status: '403',
      loginRedirect: true,
    });
  }

  // Verifikasi token
  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(403).render('403', {
        message: 'Akses ini hanya milik admin, silahkan login',
        href: '/',
        status: '403',
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