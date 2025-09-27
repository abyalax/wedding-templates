import type { Module } from "../main";

export class LandingPage implements Module {
    init = () => this.bindEvents()

    private bindEvents = () => {
        // Ambil parameter dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const nama = urlParams.get('nama') || ''; // Ambil 'nama' dari URL
        const pronoun = urlParams.get('p') || 'Bapak/Ibu/Saudara/i,'; // Ambil sapaan

        // Menampilkan nama dan sapaan di elemen
        const namaContainer = document.querySelector('#nama');
        if (namaContainer) {
            namaContainer.innerHTML = `${pronoun} ${nama}`.replace(/ ,$/, ','); // Menambahkan sapaan dan nama
        }
    }
}