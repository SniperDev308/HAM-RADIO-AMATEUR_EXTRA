# 📡 Amateur Extra – Estudio FCC Elemento 4 (2024-2028)

Aplicación de estudio en **español** para el examen FCC **Amateur Extra Class**, con 552 preguntas del banco oficial vigente del 1 de julio de 2024 al 30 de junio de 2028.

🔗 **App en vivo:** https://sniperdev308.github.io/Ham-Radio-Study-Extra/

---

## ✨ Características

| Función | Descripción |
|---|---|
| 📖 **Repasar** | Todas las preguntas con feedback inmediato |
| ⚡ **Flashcards** | Tarjetas 3D con flip animado |
| 🎯 **Simulador de Examen** | 50 preguntas distribuidas exactamente como la FCC |
| 💡 **Instructor IA** | Explicaciones en español vía GPT-4o-mini |
| 📊 **Estadísticas** | Guardadas en localStorage por sesión |
| 🔍 **Filtro por subelemento** | Estudia E1–E0 por separado o todos juntos |

## 📋 Distribución del examen (50 preguntas)

| Subelemento | Tema | Preguntas |
|---|---|---|
| E1 | Reglas de la Comisión | 6 |
| E2 | Procedimientos de Operación | 5 |
| E3 | Propagación | 3 |
| E4 | Práctica de la Radioafición | 5 |
| E5 | Principios Eléctricos | 4 |
| E6 | Componentes del Circuito | 6 |
| E7 | Circuitos Prácticos | 8 |
| E8 | Señales y Emisiones | 4 |
| E9 | Antenas y Líneas de Alimentación | 8 |
| E0 | Seguridad Eléctrica y RF | 1 |
| **Total** | | **50** |

**Aprobatorio: 74% (37/50 correctas)**

---

## 🚀 Deploy en GitHub Pages

```bash
# 1. Crear repositorio nuevo en GitHub: Ham-Radio-Study-Extra
# 2. Subir los archivos
git init
git add index.html README.md
git commit -m "Initial commit – Extra Class 2024-2028"
git branch -M main
git remote add origin https://github.com/sniperdev308/Ham-Radio-Study-Extra.git
git push -u origin main

# 3. En GitHub: Settings → Pages → Source: main / root → Save
```

---

## ⚙️ Cloudflare Worker (API)

El Worker maneja:
- `POST /explain` — Explicaciones IA vía GPT-4o-mini
- `POST /tts` — Text-to-Speech vía OpenAI nova
- `GET /health` — Health check

### Deploy del Worker

```bash
cd worker/
npm install -g wrangler

# Login
wrangler login

# Configurar el secret (API key de OpenAI)
wrangler secret put OPENAI_API_KEY

# Deploy
wrangler deploy
```

### Actualizar CORS

Si usas un Worker **nuevo** (URL diferente a `ham-radio-api.franklinsandovalit.workers.dev`), actualiza en `index.html`:

```javascript
const API = "https://TU-WORKER.workers.dev";
```

Y en `worker.js`:
```javascript
const ALLOWED_ORIGIN = "https://sniperdev308.github.io";
```

---

## 📁 Estructura del proyecto

```
Ham-Radio-Study-Extra/
├── index.html          # App completa (auto-contenida)
├── README.md           # Este archivo
└── worker/
    ├── worker.js       # Cloudflare Worker
    └── wrangler.toml   # Configuración de Wrangler
```

---

## 📜 Créditos

- Banco de preguntas oficial NCVEC 2024-2028
- Traducción al español basada en el trabajo de Héctor A. Morales Anaya, NP3IR (elvigilante.info) bajo CC-BY 4.0
- App desarrollada por Franklin / sniperdev308

