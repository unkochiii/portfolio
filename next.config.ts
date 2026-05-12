/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Active le mode statique
  distDir: "out", // ou 'dist' si tu veux
  images: {
    unoptimized: true, // Obligatoire sur hébergement mutualisé
  },
  // Si tu as des Server Actions → il faudra les supprimer ou les remplacer
};

module.exports = nextConfig;
