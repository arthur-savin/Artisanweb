const fs = require('fs');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

// Minifier le CSS
const cssFile = 'style.css';
const cssOutputFile = 'style.min.css';

if (fs.existsSync(cssFile)) {
  const css = fs.readFileSync(cssFile, 'utf8');
  const minifier = new CleanCSS({
    level: 2, // Niveau d'optimisation maximal
    compatibility: '*', // Compatibilité avec tous les navigateurs
  });
  
  const result = minifier.minify(css);
  
  if (result.errors && result.errors.length > 0) {
    console.error('❌ Erreurs lors de la minification CSS:');
    result.errors.forEach(err => console.error(err));
    process.exit(1);
  }
  
  fs.writeFileSync(cssOutputFile, result.styles);
  const originalSize = (fs.statSync(cssFile).size / 1024).toFixed(2);
  const minifiedSize = (result.styles.length / 1024).toFixed(2);
  const reduction = ((1 - result.styles.length / css.length) * 100).toFixed(1);
  
  console.log(`✅ CSS minifié avec succès !`);
  console.log(`   Original: ${originalSize} KB`);
  console.log(`   Minifié: ${minifiedSize} KB`);
  console.log(`   Réduction: ${reduction}%`);
  console.log('');
} else {
  console.error(`❌ Fichier ${cssFile} introuvable`);
  process.exit(1);
}

// Minifier le JavaScript
const jsFile = 'app.js';
const jsOutputFile = 'app.min.js';

if (fs.existsSync(jsFile)) {
  const js = fs.readFileSync(jsFile, 'utf8');
  
  minify(js, {
    compress: true,
    mangle: true,
    format: {
      comments: false,
    },
  }).then(result => {
    fs.writeFileSync(jsOutputFile, result.code);
    const originalSize = (fs.statSync(jsFile).size / 1024).toFixed(2);
    const minifiedSize = (result.code.length / 1024).toFixed(2);
    const reduction = ((1 - result.code.length / js.length) * 100).toFixed(1);
    
    console.log(`✅ JavaScript minifié avec succès !`);
    console.log(`   Original: ${originalSize} KB`);
    console.log(`   Minifié: ${minifiedSize} KB`);
    console.log(`   Réduction: ${reduction}%`);
  }).catch(err => {
    console.error('❌ Erreur lors de la minification JavaScript:');
    console.error(err);
    process.exit(1);
  });
} else {
  console.error(`❌ Fichier ${jsFile} introuvable`);
  process.exit(1);
}

