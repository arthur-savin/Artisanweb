# Guide : Intégration d'Images Générées par IA

Ce guide vous explique comment remplacer les images Unsplash par des images générées par IA pour votre site de menuiserie.

## 📸 Images Actuellement Utilisées

Le site utilise actuellement des images **Unsplash** (libres de droits) comme placeholders. Toutes les images sont intégrées via des URLs dans le fichier `index.html`.

## 🤖 Génération d'Images par IA

### Outils Recommandés

1. **Midjourney** (https://midjourney.com)
   - Excellent pour des rendus réalistes et artistiques
   - Idéal pour les intérieurs et extérieurs

2. **DALL-E 3** (via ChatGPT Plus ou Bing)
   - Très bon pour des images réalistes
   - Facile à utiliser avec des prompts en français

3. **Stable Diffusion** (via Hugging Face ou Replicate)
   - Open source et gratuit
   - Très personnalisable

4. **Leonardo.ai** (https://leonardo.ai)
   - Gratuit avec limitations
   - Bon pour les intérieurs

### Prompts Recommandés pour Chaque Section

#### 🏠 Hero (Image principale)
```
Prompt: "Beautiful modern living room with large windows, natural light, wooden furniture, cozy atmosphere, French interior design, high quality, professional photography, 4k"
```

#### 🪟 Fenêtres PVC & Aluminium
```
Prompt: "Modern white PVC windows in a bright living room, triple glazing, contemporary French home interior, natural daylight, minimalist design, professional photography"
```

#### 🪟 Volets & Persiennes
```
Prompt: "Elegant white shutters on a French house facade, modern design, clean architecture, natural lighting, professional exterior photography"
```

#### 🚪 Portes d'Entrée
```
Prompt: "Modern entrance door, aluminum frame, contemporary design, French home exterior, elegant finish, professional photography"
```

#### 🌳 Terrasses & Pergolas
```
Prompt: "Beautiful wooden deck terrace with pergola, modern outdoor living space, French garden, natural wood finish, professional photography"
```

#### 👔 Dressing sur Mesure
```
Prompt: "Elegant custom walk-in closet, white lacquered finish, organized storage, modern French bedroom interior, professional photography, high-end design"
```

#### 🍳 Cuisine sur Mesure
```
Prompt: "Modern custom kitchen, white cabinets, wooden accents, French contemporary design, bright and spacious, professional photography"
```

#### 🪜 Escaliers Bois
```
Prompt: "Elegant wooden staircase, oak wood, modern French home interior, natural finish, architectural photography"
```

#### 🪵 Parquets
```
Prompt: "Beautiful hardwood floor, oak parquet, modern French interior, natural wood grain, professional photography"
```

#### 📸 Avant/Après - Fenêtres
**Avant:**
```
Prompt: "Old house interior with outdated single-pane windows, dim lighting, dated decor, before renovation, French home"
```

**Après:**
```
Prompt: "Same room renovated with modern triple-glazed PVC windows, bright natural light, contemporary decor, after renovation, French home"
```

#### 📸 Avant/Après - Dressing
**Avant:**
```
Prompt: "Small bedroom with minimal storage, cluttered space, before renovation, French apartment"
```

**Après:**
```
Prompt: "Same bedroom with elegant custom walk-in closet, organized storage, modern design, after renovation, French apartment"
```

#### 📸 Avant/Après - Cuisine
**Avant:**
```
Prompt: "Old kitchen with outdated cabinets, limited storage, before renovation, French home"
```

**Après:**
```
Prompt: "Same kitchen renovated with modern custom cabinets, optimized storage, contemporary design, after renovation, French home"
```

## 📁 Structure des Fichiers

Créez un dossier `images/` à la racine de votre projet :

```
site-web-menuisier/
├── images/
│   ├── hero/
│   │   └── hero-main.jpg
│   ├── services/
│   │   ├── fenetres.jpg
│   │   ├── volets.jpg
│   │   ├── portes.jpg
│   │   ├── terrasses.jpg
│   │   ├── dressing.jpg
│   │   ├── cuisine.jpg
│   │   ├── escalier.jpg
│   │   └── parquet.jpg
│   └── realisations/
│       ├── avant-fenetres.jpg
│       ├── apres-fenetres.jpg
│       ├── avant-dressing.jpg
│       ├── apres-dressing.jpg
│       ├── avant-cuisine.jpg
│       └── apres-cuisine.jpg
├── index.html
├── styles.css
└── script.js
```

## 🔄 Remplacer les Images dans le HTML

### Méthode 1 : Images Locales

1. Téléchargez vos images générées par IA dans le dossier `images/`
2. Remplacez les URLs Unsplash par des chemins relatifs :

**Exemple pour le Hero :**
```html
<!-- Avant -->
<div class="hero__image" style="background-image: url('https://images.unsplash.com/...');">

<!-- Après -->
<div class="hero__image" style="background-image: url('images/hero/hero-main.jpg');">
```

**Exemple pour les Services :**
```html
<!-- Avant -->
<div class="service-card__image" style="background-image: url('https://images.unsplash.com/...');">

<!-- Après -->
<div class="service-card__image" style="background-image: url('images/services/fenetres.jpg');">
```

### Méthode 2 : Hébergement Externe

Si vous hébergez vos images sur un CDN ou un service cloud :

1. **Cloudinary** (recommandé) : https://cloudinary.com
   - Gratuit jusqu'à 25GB
   - Optimisation automatique des images
   - URLs directes

2. **Imgur** : https://imgur.com
   - Gratuit
   - Simple à utiliser

3. **GitHub** (si vous utilisez GitHub Pages)
   - Gratuit
   - Intégré au workflow

## 📐 Dimensions Recommandées

Pour de meilleures performances, optimisez vos images :

- **Hero** : 1920x1080px (ou 1920x1200px)
- **Services** : 800x600px
- **Avant/Après** : 800x600px chacune
- **Format** : JPG (qualité 80-85%) ou WebP (meilleure compression)

## 🛠️ Outils d'Optimisation

1. **TinyPNG** : https://tinypng.com
   - Compression sans perte de qualité visible

2. **Squoosh** : https://squoosh.app
   - Outil Google pour optimiser les images

3. **ImageOptim** (Mac) ou **FileOptimizer** (Windows)
   - Compression en lot

## ✅ Checklist de Remplacement

- [ ] Générer toutes les images avec l'IA
- [ ] Optimiser les images (compression)
- [ ] Créer la structure de dossiers `images/`
- [ ] Télécharger les images dans les bons dossiers
- [ ] Remplacer toutes les URLs Unsplash dans `index.html`
- [ ] Tester le site localement
- [ ] Vérifier que toutes les images s'affichent correctement
- [ ] Tester sur mobile (responsive)

## 💡 Conseils Pro

1. **Cohérence visuelle** : Utilisez le même style pour toutes les images (même éclairage, même ambiance)

2. **Aspect ratio** : Respectez les proportions pour éviter les déformations

3. **Alt text** : Ajoutez des attributs `alt` descriptifs pour le SEO :
   ```html
   <div class="service-card__image" 
        style="background-image: url('images/services/fenetres.jpg');"
        role="img"
        aria-label="Fenêtres PVC modernes dans un salon lumineux">
   ```

4. **Lazy loading** : Pour améliorer les performances, ajoutez `loading="lazy"` si vous utilisez des balises `<img>`

5. **WebP** : Utilisez le format WebP pour de meilleures performances (avec fallback JPG)

## 🎨 Style Visuel Recommandé

Pour correspondre à l'identité du site (chaleureux, élégant, cosy) :

- **Lumière** : Naturelle, douce, chaleureuse
- **Couleurs** : Tons bois (chêne clair, noyer), blancs, bleu nuit, vert forêt
- **Ambiance** : Cosy, élégant, moderne mais chaleureux
- **Style** : Français contemporain, artisanal de qualité

## 📞 Besoin d'Aide ?

Si vous avez des questions sur l'intégration des images, n'hésitez pas à consulter la documentation de votre outil d'IA ou à demander de l'aide pour les prompts spécifiques.

