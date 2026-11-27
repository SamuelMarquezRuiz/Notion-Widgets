# Notion-Widgets

Colección de widgets web minimalistas, responsivos y sin dependencias externas diseñados para incrustarse en **Notion** mediante `/embed`.

## Estructura del proyecto

```text
/
├── README.md                   # Documentación del proyecto y catálogo de widgets
├── index.html                  # Galería principal para previsualizar widgets y copiar sus URLs
├── shared/
│   ├── theme.css               # Variables CSS globales (fondos y textos nativos de Notion)
│   └── theme.js                # Utilidad para leer query params (?theme=light|dark)
└── widgets/
    └── life-progress/
        ├── index.html
        ├── style.css
        └── script.js
```

## Cómo usar un widget en Notion

1. Abre la galería principal (`index.html`) o copia directamente la ruta del widget desplegado en GitHub Pages / Vercel.
2. Añade el parámetro `?theme=light` o `?theme=dark` según el tema de tu espacio de trabajo en Notion (si se omite, se adapta automáticamente a la preferencia del sistema).
3. En Notion, escribe `/embed`, pega la URL del widget y ajusta el tamaño del bloque libremente.

### Parámetros globales soportados

| Parámetro | Valores | Descripción |
| :--- | :--- | :--- |
| `theme` | `light`, `dark` | Fuerza el fondo nativo de Notion (`#ffffff` en claro, `#191919` en oscuro) y sus colores de texto. |

---

## Catálogo de widgets

| Widget | Ruta | Descripción | Parámetros URL |
| :--- | :--- | :--- | :--- |
| **Life Progress** | `/widgets/life-progress/` | Muestra en tiempo real el porcentaje transcurrido del Año (`Year`), Mes (`Month`), Semana (`Week`, empezando en lunes) y Día (`Day`) según la hora local, con actualización automática cada minuto. | `theme=light\|dark`<br>`decimals=0\|1\|2` (por defecto `1`) |
