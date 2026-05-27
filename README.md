# IEEE CS UTP — Postulaciones 2026

Landing + flow de evaluación + pantalla post-aplicación. Static HTML, sin build, sin backend.

## Estructura

```
deploy-vercel/
├── index.html              ← entrada (landing → flow → resultado)
├── assets/
│   ├── logo-horizontal.svg     (lockup oficial IEEE CS UTP, header)
│   └── logo-stacked-white.png  (lockup stacked, result hero)
└── vercel.json             ← config Vercel (cache + headers seguridad)
```

## Deploy en Vercel

**Opción 1 — drag & drop:**
1. Andá a [vercel.com/new](https://vercel.com/new)
2. Arrastra esta carpeta entera al uploader
3. Framework preset: **Other** (static)
4. Build/Output: dejá vacío
5. Deploy → conectá dominio `ieeecsutp.org` en Settings → Domains

**Opción 2 — CLI:**
```bash
npm i -g vercel
cd deploy-vercel
vercel --prod
```

**Opción 3 — git:**
1. Subí esta carpeta a un repo GitHub
2. Import desde Vercel apuntando al repo
3. Root directory: `deploy-vercel/` (si está en subcarpeta)

## Dominio

Configurado para `https://ieeecsutp.org/`. Si cambia, actualizá:
- `<link rel="canonical">`
- `<meta property="og:*">` en `index.html`
- Email `hola@ieeecsutp.org` en el result hero

## Notas técnicas

- Mockup sin backend: el form NO envía a ningún lado. Para producción, conectá el `submit` final a Google Sheets / Supabase / lo que prefieran RRHH.
- Fonts cargan desde Google Fonts (preconnect). Funciona offline-degraded a system fonts.
- Mobile-first, responsive hasta 1400px wide.
- Reduced-motion respetado.

## Iteraciones futuras posibles

- Sello 80° aniversario IEEE CS (válido solo 2026)
- Conectar submit a backend real
- Analytics (Plausible, Vercel Analytics)
- Test A/B copy del headline
