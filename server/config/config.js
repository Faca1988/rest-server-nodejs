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

// =============================================
// ====== Fecha de vencimiento del token =======

// 60 segundo * 60 minutos * 24 hrs * 30 días
process.env.EXPIRED_TOKEN_AT = '48h';

// =============================================

// =============================================
// ================= ENTORNO ===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';

// =============================================


// =============================================
// ================= GOOGLE CLIENT ID ===================

process.env.CLIENT_ID = process.env.CLIENT_ID || "479427768852-1rrmtne371b880ughq916snlq3ife5m0.apps.googleusercontent.com";

// =============================================