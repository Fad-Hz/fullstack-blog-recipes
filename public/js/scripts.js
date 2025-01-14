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

document.getElementById('sendMessage').addEventListener('click', function () {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !message) {
        alert('Mohon isi semua bidang sebelum mengirim pesan.');
        return;
    }

    const phone = '6288297758043'; // Nomor WhatsApp tujuan
    const encodedMessage = encodeURIComponent(`Halo, saya ${name}. ${message}`);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Membuka WhatsApp di perangkat
    window.location.href = whatsappUrl;
});