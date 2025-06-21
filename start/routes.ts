import Route from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

/*
|--------------------------------------------------------------------------
| Rute Aplikasi
|--------------------------------------------------------------------------
*/

// --- 1. RUTE PUBLIK & AUTENTIKASI ---

// Halaman utama
Route.on('/').render('pages/auth/donatur_auth_page').as('home')

// Autentikasi Admin
Route.get('admin/login', '#controllers/auth/admin_auth_controller.showLogin').as('admin.login.show')
Route.post('admin/login', '#controllers/auth/admin_auth_controller.login').as('admin.login.store')
Route.post('admin/logout', '#controllers/auth/admin_auth_controller.logout').as('admin.logout')
// Jika Anda butuh register admin, tambahkan di sini
// Route.get('admin/register', '#controllers/auth/admin_auth_controller.showRegister').as('admin.register.show')
// Route.post('admin/register', '#controllers/auth/admin_auth_controller.register').as('admin.register.store')


// Autentikasi Donatur (halaman login & register terpadu)
Route.on('/donatur/auth').render('pages/auth/donatur_auth_page').as('donatur.auth')
Route.post('/donatur/login', '#controllers/auth/donatur_auth_controller.login').as('donatur.login.store')
Route.post('/donatur/register', '#controllers/auth/donatur_auth_controller.register').as('donatur.register.store')
Route.post('/donatur/logout', '#controllers/auth/donatur_auth_controller.logout').as('donatur.logout')


// --- 2. RUTE AREA DONATUR (TERLINDUNGI) ---
// Hanya bisa diakses oleh Donatur yang sudah login.
Route.group(() => {
  Route.get('dashboard', '#controllers/donatur_dashboard_controller.index').as('dashboard')
  Route.get('donasi/:kampanye_id', '#controllers/donasi_form_controller.show').as('donasi.create')
  Route.post('donasi', '#controllers/donasi_form_controller.store').as('donasi.store')
  Route.get('riwayat', '#controllers/donatur/riwayat_donasi_controller.index').as('riwayat')
}).prefix('member').as('donatur').use(middleware.auth({ guards: ['donatur'] }))


// --- 3. RUTE AREA ADMIN (TERLINDUNGI) ---
// Hanya bisa diakses oleh Admin yang sudah login DAN memiliki peran 'admin'.
Route.group(() => {
  Route.get('dashboard', '#controllers/admin_dashboard_controller.index').as('dashboard')
  
  // Rute resource untuk semua manajemen
  Route.resource('kategori', '#controllers/kategoris_controller')
  Route.resource('donatur', '#controllers/donaturs_controller')
  Route.resource('kampanye', '#controllers/kampanyes_controller')
  Route.resource('donasi', '#controllers/donasis_controller')
  Route.resource('transaksi', '#controllers/transaksi_donasis_controller').only(['index'])

}).prefix('admin').as('admin').use([middleware.auth()]) // Dilindungi oleh DUA middleware
