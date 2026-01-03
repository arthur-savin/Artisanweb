# 📊 AUDIT PERFORMANCE - WEB ARTISANT

**Date** : Analyse initiale  
**Objectif** : Optimiser pour 60 FPS, Core Web Vitals (LCP < 2,5s, CLS < 0,1, INP excellent), réseau 3G mobile

---

## 1. RÉSUMÉ DE LA STRUCTURE DU PROJET

### Architecture
- **Type** : Site statique HTML/CSS/JS avec backend Node.js/Express
- **Stack** : HTML5, CSS3 (vanilla), JavaScript (vanilla), Express.js, SQLite
- **Pages** : 1 page principale (index.html) + admin.html
- **Build** : Aucun (fichiers bruts servis directement)
- **Serveur** : Express.js serveur de fichiers statiques

### Fichiers principaux
- `index.html` : 953 lignes (code JS inline problématique lignes 532-584)
- `style.css` : 2896 lignes, non minifié
- `app.js` : 584 lignes, non minifié
- `server.js` : Serveur Express basique (pas de compression/optimisation)

### Ressources externes
- **Google Fonts** : Roboto (300, 400, 500, 700) + Bebas Neue
- **Images** : PNG/JPG (pas de WebP/AVIF détecté)
- **Scripts tiers** : Aucun

---

## 2. LES 10 PRINCIPAUX RISQUES DE "LAG" (classés par impact)

### 🔴 **P0 - CRITIQUES (Impact fort, corrigeable rapidement)**

#### **1. CODE JAVASCRIPT INLINE DANS LE HTML (lignes 532-584)**
- **Symptôme** : Blocage du parsing HTML, JS exécuté avant le DOM ready, pas de cache navigateur
- **Cause** : ~50 lignes de JS dupliquées/inutiles dans index.html
- **Impact** : +50-100ms de parsing, pas de cache séparé
- **Fichier** : `index.html` lignes 532-584

#### **2. CSS NON MINIFIÉ (2896 lignes)**
- **Symptôme** : Fichier CSS volumineux, téléchargement lent sur 3G
- **Cause** : CSS développeur avec commentaires, espaces, formatage
- **Impact** : ~80-120 KB non minifiés → ~50-70 KB minifiés (économie ~40%)
- **Fichier** : `style.css`

#### **3. BACKDROP-FILTER MULTIPLE (propriété très coûteuse)**
- **Symptôme** : Repaint/reflow coûteux, lag sur mobile bas de gamme
- **Cause** : Utilisé sur header, cartes témoignage, modal (210 occurrences de propriétés coûteuses)
- **Impact** : -20-30 FPS sur mobile, reflow répétés
- **Fichier** : `style.css` (lignes 231, 1140, 2093, etc.)

#### **4. GOOGLE FONTS SANS OPTIMISATION**
- **Symptôme** : FOIT (Flash Of Invisible Text), LCP dégradé, blocage du rendu
- **Cause** : Chargement synchrone, pas de font-display: swap, pas de preload, pas de subset
- **Impact** : +300-500ms sur LCP, CLS potentiel si fonts chargées tard
- **Fichier** : `index.html` lignes 44-49

#### **5. IMAGES NON OPTIMISÉES (PNG/JPG au lieu de WebP/AVIF)**
- **Symptôme** : Images lourdes, LCP dégradé, bande passante gaspillée
- **Cause** : Format PNG/JPG non compressé, pas de formats modernes (WebP/AVIF)
- **Impact** : -40-60% de poids possible, LCP +500ms-1s sur 3G
- **Fichiers** : Toutes les images dans `images/`

---

### 🟡 **P1 - STRUCTURANTS (Impact moyen-élevé, nécessite plus de travail)**

#### **6. JAVASCRIPT NON MINIFIÉ + MULTIPLES EVENT LISTENERS (23 listeners)**
- **Symptôme** : JS lourd, listeners non optimisés, pas de debounce/throttle sur scroll/resize
- **Cause** : Code développeur, listeners sur scroll/resize sans optimisation
- **Impact** : Main thread bloqué, scroll lag sur mobile
- **Fichier** : `app.js`

#### **7. ANIMATIONS CSS MULTIPLES (210 occurrences transform/animation)**
- **Symptôme** : Animations simultanées, GPU overuse, lag sur scroll
- **Cause** : Nombreuses animations (fadeInUp, float, pulse, rotate, etc.) simultanées
- **Impact** : -10-15 FPS sur scroll, consommation GPU élevée
- **Fichier** : `style.css` (lignes 22-89, nombreuses utilisations)

#### **8. PARALLAXE AU SCROLL (fonction initParallax)**
- **Symptôme** : Recalcul à chaque scroll, lag visible
- **Cause** : Event listener scroll sans throttle, transform sur body::before
- **Impact** : Main thread bloqué, -5-10 FPS
- **Fichier** : `app.js` lignes 561-580, `style.css` lignes 118-132

#### **9. IMAGES HERO SANS PRELOAD/EAGER LOADING**
- **Symptôme** : LCP dégradé (images hero chargées en lazy)
- **Cause** : Images hero avec `loading="lazy"` alors qu'elles sont above-the-fold
- **Impact** : LCP +500ms-1s
- **Fichier** : `index.html` lignes 109, 115, 121

#### **10. ABSENCE DE COMPRESSION SERVEUR (Gzip/Brotli)**
- **Symptôme** : Fichiers servis non compressés, téléchargement lent
- **Cause** : Serveur Express sans middleware compression
- **Impact** : +60-70% de poids réseau (CSS/JS/HTML)
- **Fichier** : `server.js`

---

## 3. PLAN D'ACTION PRIORISÉ

### **P0 - QUICK WINS (Impact fort, faible risque, < 2h de travail)**

| # | Item | Symptôme → Cause → Correctif | Fichiers | Critères d'acceptation |
|---|------|------------------------------|----------|------------------------|
| **P0.1** | Supprimer JS inline du HTML | Code dupliqué dans HTML → Nettoyer index.html | `index.html` (lignes 532-584) | Aucun `<script>` inline, tout dans app.js |
| **P0.2** | Minifier CSS | CSS non minifié → Ajouter minification | `style.css` | CSS minifié, -40% de taille |
| **P0.3** | Optimiser Google Fonts | FOIT, pas de swap → Preload + font-display: swap + subset | `index.html` (lignes 44-49) | Preconnect + preload font, font-display: swap |
| **P0.4** | Eager loading images hero | Lazy sur images above-fold → Retirer lazy, ajouter fetchpriority | `index.html` (lignes 88, 109, 115, 121) | Hero images avec fetchpriority="high" |
| **P0.5** | Compression serveur (Gzip) | Pas de compression → Ajouter compression middleware | `server.js` | Compression Gzip activée, -60% poids réseau |

---

### **P1 - STRUCTURANTS (Impact moyen-élevé, 4-8h de travail)**

| # | Item | Symptôme → Cause → Correctif | Fichiers | Critères d'acceptation |
|---|------|------------------------------|----------|------------------------|
| **P1.1** | Réduire backdrop-filter | Propriété coûteuse → Remplacer par background semi-transparent | `style.css` | Backdrop-filter supprimé ou limité, performance mobile améliorée |
| **P1.2** | Minifier JavaScript | JS non minifié → Minification | `app.js` | JS minifié, -30% de taille |
| **P1.3** | Debounce/throttle scroll/resize | Listeners non optimisés → Ajouter debounce/throttle | `app.js` | Scroll/resize throttlés à 16ms (60fps) |
| **P1.4** | Optimiser animations CSS | Trop d'animations simultanées → Réduire, utiliser will-change, prefers-reduced-motion | `style.css` | Animations optimisées, will-change ajouté |
| **P1.5** | Convertir images en WebP | Images lourdes → Conversion WebP avec fallback | `images/` + `index.html` | Images WebP avec fallback JPG, -40% poids |
| **P1.6** | Précharger ressources critiques | Pas de preload → Ajouter preload pour CSS/fonts critiques | `index.html` <head> | Preload CSS + fonts critiques |

---

### **P2 - NICE-TO-HAVE (Améliorations supplémentaires, 2-4h)**

| # | Item | Symptôme → Cause → Correctif | Fichiers | Critères d'acceptation |
|---|------|------------------------------|----------|------------------------|
| **P2.1** | Désactiver parallaxe sur mobile | Parallaxe coûteuse → Désactiver si mobile/prefers-reduced-motion | `app.js` | Parallaxe désactivée mobile (déjà partiellement fait) |
| **P2.2** | CSS critique inline | CSS bloquant → Extraire CSS above-fold | `index.html` <head> | CSS critique inline, reste en fichier |
| **P2.3** | Cache headers navigateur | Pas de cache → Ajouter Cache-Control/ETag | `server.js` | Headers cache configurés (1 an pour assets) |
| **P2.4** | Réduire box-shadow excessifs | Ombre coûteuses → Simplifier ombres | `style.css` | Box-shadow réduits, performance améliorée |
| **P2.5** | Lazy load images below-fold | Toutes images → Lazy load uniquement below-fold | `index.html` | Images below-fold en lazy, above-fold eager |

---

## 4. MESURE & OBJECTIFS

### Performance Budget (cible 3G mobile)

| Métrique | Baseline (estimé) | Cible | Vérification |
|----------|------------------|-------|--------------|
| **LCP** | ~3-4s | < 2,5s | Lighthouse / DevTools |
| **CLS** | ~0,15-0,2 | < 0,1 | Lighthouse / DevTools |
| **INP** | ~200-300ms | < 200ms | Lighthouse / DevTools |
| **FCP** | ~2-3s | < 1,8s | Lighthouse |
| **TBT** | ~300-500ms | < 200ms | Lighthouse |
| **Taille CSS** | ~80-120 KB | < 50 KB (minifié) | Network tab |
| **Taille JS** | ~15-20 KB | < 12 KB (minifié) | Network tab |
| **Taille HTML** | ~30-40 KB | < 25 KB (minifié) | Network tab |
| **Images hero** | Non optimisées | < 100 KB total (WebP) | Network tab |
| **Requêtes réseau** | ~15-20 | < 12 | Network tab |

### Procédure de mesure

1. **Lighthouse** (Chrome DevTools) :
   - Mode : Mobile (3G throttling)
   - Métriques : Performance, Core Web Vitals
   - Exécuter 3 fois, prendre la moyenne

2. **DevTools Network** :
   - Throttling : Fast 3G
   - Vérifier : Taille fichiers, nombre requêtes, waterfall

3. **Performance Profiler** :
   - Enregistrer scroll/interaction
   - Vérifier : FPS, main thread blocking, repaint/reflow

---

## 5. MODIFICATIONS CONCRÈTES (à venir)

Les modifications seront appliquées étape par étape selon le plan P0 → P1 → P2.

Chaque modification sera :
- ✅ Testée localement
- ✅ Vérifiée avec Lighthouse/DevTools
- ✅ Documentée avec avant/après

---

**Prochaines étapes** : Commencer par les modifications P0 (quick wins).

