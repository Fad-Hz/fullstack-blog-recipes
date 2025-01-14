const User = require('../models/User'); // Sesuaikan dengan path model User Anda
const jwt = require('jsonwebtoken'); // Untuk token autentikasi

// Controller untuk merender halaman login form
const renderLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login',
        href: '/'
    });
};

// Controller untuk login dan memberikan token
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validasi input sederhana
        if (!email || !password) {
            return res.status(400).render('403', {
                title: '400 Bad Request',
                href: '/',
                message: 'Email and password are required.',
                status: '400'
            });
        }

        // Mencari user berdasarkan email
        const user = await User.findOne({ email });

        // Jika user tidak ditemukan atau password tidak cocok
        if (!user || user.password !== password) {
            return res.status(401).render('403', {
                title: '400 Bad Request',
                href: '/',
                message: 'Email atau Password salah',
                status: '400'
            });
        }

        // Membuat token jika autentikasi berhasil
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secretKey', // Gunakan variabel lingkungan untuk kunci rahasia
            { expiresIn: '1h' }
        );

        // Menyimpan token ke dalam cookie atau mengirimkannya melalui response
        res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Redirect ke dashboard admin atau halaman lainnya
        return res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).render('500', {
            title: '500',
            href: '/',
            message: 'An error occurred. Please try again later.'
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('auth_token'); // Hapus cookie token
    return res.redirect('/'); // Redirect ke halaman login
};


module.exports = { renderLoginForm, login, logout };
