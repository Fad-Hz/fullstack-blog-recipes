document.addEventListener('DOMContentLoaded', () => {
    // Pilih semua elemen dengan class animate-fade-up
    const animatedElements = document.querySelectorAll('.animate-fade-up');

    // Fungsi untuk menangani animasi saat elemen masuk ke viewport
    const observerOptions = {
        root: null, // null berarti viewport (jendela browser)
        threshold: 0.25 // Animasi akan dipicu saat 25% elemen terlihat
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan kelas visible untuk memicu animasi
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Hentikan pengamatan setelah animasi dimulai
            }
        });
    };

    // Membuat observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Mulai mengamati elemen
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah form submit biasa

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // Membuat pesan WhatsApp
    var whatsappMessage = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nMessage: " + message);

    // Redirect ke WhatsApp
    var whatsappUrl = "https://wa.me/6288297758043?text=" + whatsappMessage;
    window.location.href = whatsappUrl;
});