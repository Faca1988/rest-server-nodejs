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
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const cluster = process.env.MONGO_CLUSTER;


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = `mongodb+srv://${user}:${password}@${cluster}/Coffee`;
}
process.env.URLDB = urlDB;
// =============================================