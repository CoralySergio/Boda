# 📸 Assets — Imágenes e Infografías

Coloca aquí las imágenes y recursos gráficos de la invitación.

## Estructura sugerida

```
assets/
├── photos/
│   ├── jorge.jpg          ← Foto de Jorge
│   ├── coral.jpg          ← Foto de Coral
│   ├── pareja.jpg         ← Foto juntos (opcional)
│   └── lugar.jpg          ← Foto del Jardín los Cerezos
└── icons/
    └── (infografías adicionales)
```

## Cómo usar las fotos

En `index.html`, busca los `<div class="photo-placeholder">` y sustitúyelos por:

```html
<img src="assets/photos/jorge.jpg" alt="Jorge">
```

## Tamaños recomendados

| Imagen | Tamaño | Ratio |
|--------|--------|-------|
| Fotos de pareja | 600×800 px | 3:4 |
| Foto del lugar | 800×450 px | 16:9 |
| Iconos/infografías | 200×200 px | 1:1 |

> Usa formato **JPG** para fotos y **SVG** o **PNG** para iconos/infografías.
