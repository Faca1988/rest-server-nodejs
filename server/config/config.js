// =============================================
// ================== PUERTO ===================

process.env.PORT = process.env.PORT || 3000;

// =============================================


// =============================================
// ================= ENTORNO ===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================================


// =============================================
// ============== BASE DE DATOS ================

let urlDB;
const user = 'guntzlinger';
const password = 'yVPAHnG9EOHVO0kj';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = `mongodb+srv://${user}:${password}@cluster0.98m3b.mongodb.net/Coffee`;
}
process.env.URLDB = urlDB;
// =============================================