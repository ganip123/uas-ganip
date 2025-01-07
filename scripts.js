// Inisialisasi keranjang dan history transaksi
let keranjang = [];
let historyTransaksi = [];

// Fungsi tambah ke keranjang
function tambahKeranjang(idProduk, namaProduk, harga) {
  const produk = {
    id: idProduk,
    nama: namaProduk,
    harga: harga,
    jumlah: 1
  };

  const index = keranjang.findIndex((item) => item.id === idProduk);
  if (index === -1) {
    keranjang.push(produk);
  } else {
    keranjang[index].jumlah++;
  }

  tampilkanKeranjang();
}

// Fungsi tampilkan keranjang
function tampilkanKeranjang() {
  const keranjangElement = document.getElementById("keranjang");
  keranjangElement.innerHTML = "";

  keranjang.forEach((produk) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${produk.nama}</td>
      <td>Rp ${produk.harga.toLocaleString()}</td>
      <td>${produk.jumlah}</td>
      <td>Rp ${produk.harga * produk.jumlah}</td>
      <td><button onclick="hapusKeranjang('${produk.id}')">Hapus</button></td>
    `;
    keranjangElement.appendChild(row);
  });

  const totalHarga = keranjang.reduce((total, produk) => total + produk.harga * produk.jumlah, 0);
  document.getElementById("total").textContent = totalHarga.toLocaleString();
}

// Fungsi hapus produk dari keranjang
function hapusKeranjang(idProduk) {
  const index = keranjang.findIndex((item) => item.id === idProduk);
  if (index !== -1) {
    keranjang.splice(index, 1);
  }
  tampilkanKeranjang();
}

// Fungsi untuk memproses pemesanan dan menyimpan transaksi
function prosesTransaksi() {
  const namaPembeli = document.getElementById("name").value;
  const alamatPengiriman = document.getElementById("address").value;
  const totalHarga = keranjang.reduce((total, produk) => total + produk.harga * produk.jumlah, 0);

  // Membuat objek transaksi
  const transaksi = {
    id: new Date().toISOString(),
    produk: keranjang,
    total: totalHarga,
    namaPembeli: namaPembeli,
    alamatPengiriman: alamatPengiriman,
    tanggal: new Date().toLocaleString()
  };

  // Menambahkan transaksi ke history
  historyTransaksi.push(transaksi);

  // Tampilkan history transaksi
  tampilkanHistoryTransaksi();

  // Reset keranjang setelah pemesanan
  keranjang = [];
  tampilkanKeranjang(); // Update keranjang setelah pemesanan

  // Clear input form
  document.getElementById("name").value = '';
  document.getElementById("address").value = '';
  document.getElementById("phone").value = '';
  document.getElementById("quantity").value = '';
}

// Fungsi untuk menampilkan history transaksi
function tampilkanHistoryTransaksi() {
  const historyTableBody = document.getElementById("history-table").getElementsByTagName("tbody")[0];
  historyTableBody.innerHTML = ""; // Kosongkan tabel sebelum menambahkan data baru

  historyTransaksi.forEach((transaksi, index) => {
    transaksi.produk.forEach((produk) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${produk.nama}</td>
        <td>${produk.jumlah}</td>
        <td>Rp ${produk.harga * produk.jumlah}</td>
        <td>${transaksi.namaPembeli}</td>
        <td>${transaksi.alamatPengiriman}</td>
        <td>${transaksi.tanggal}</td>
      `;
      historyTableBody.appendChild(row);
    });
  });
}

// Menambahkan event listener ke tombol "Pesan Sekarang"
const orderForm = document.querySelector("form");
orderForm.addEventListener("submit", function(event) {
  event.preventDefault();
  prosesTransaksi();
});

// Menambahkan event listener ke tombol "Tambah ke Keranjang"
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", function() {
    const idProduk = button.getAttribute("data-id");
    const namaProduk = button.previousElementSibling.previousElementSibling.textContent;
    const harga = parseInt(button.getAttribute("data-harga"));
    tambahKeranjang(idProduk, namaProduk, harga);
  });
});
