# 🖼️ GUIDE DE CONVERSION WEBP

## Instructions pour convertir les images en WebP

Les images doivent être converties en WebP pour réduire le poids de 40-60% tout en conservant une bonne qualité.

### Images à convertir (par priorité)

1. **Images hero (critiques pour LCP)** :
   - `images/PORTFOLIO/portfolio-1.jpg` → `portfolio-1.webp`
   - `images/PORTFOLIO/portfolio-2.jpg` → `portfolio-2.webp`
   - `images/PORTFOLIO/portfolio-3.jpg` → `portfolio-3.webp`

2. **Logo (au-dessus de la ligne de flottaison)** :
   - `images/LOGOS/logo transparent.png` → `logo transparent.webp`

3. **Images portfolio (carrousel)** :
   - `images/PORTFOLIO/portfolio-4.jpg` → `portfolio-4.webp`
   - `images/PORTFOLIO/portfolio-5.jpg` → `portfolio-5.webp`

4. **Images témoignage** :
   - `images/Arthur/Arthur.jpg` → `Arthur.webp`

### Outils de conversion

**Option 1 : cwebp (Google)**
```bash
# Installer cwebp
# Windows: télécharger depuis https://developers.google.com/speed/webp/download

# Convertir une image
cwebp -q 80 input.jpg -o output.webp
```

**Option 2 : ImageMagick**
```bash
# Convertir avec ImageMagick
magick convert input.jpg -quality 80 output.webp
```

**Option 3 : En ligne**
- https://squoosh.app/ (recommandé)
- https://convertio.co/jpg-webp/

### Qualité recommandée
- **Hero images** : 85-90 (haute qualité)
- **Portfolio** : 80-85 (qualité moyenne-élevée)
- **Avatars/icônes** : 75-80 (qualité moyenne)

### Structure HTML déjà préparée

Le HTML utilise déjà `<picture>` avec `<source>` pour WebP et fallback JPG/PNG. Une fois les images WebP créées, elles seront automatiquement utilisées par les navigateurs compatibles.

### Vérification

Après conversion, vérifier :
1. Qualité visuelle acceptable
2. Taille réduite d'au moins 30-40%
3. Compatibilité navigateurs (fallback JPG/PNG fonctionne)

