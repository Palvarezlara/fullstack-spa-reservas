Ramas de features

feature/estructura-html

    Objetivo: crear todas las páginas (index, productos, producto, blogs, blog-detalle, nosotros, contacto, login, registro) con HTML semántico y enlaces funcionando.

    Commits sugeridos:

        feat: crear index.html con estructura semántica

        feat: agregar páginas secundarias (productos, blogs, contacto, etc.)

        chore: enlazar todas las páginas en navbar y footer

feature/bootstrap-layout

        Objetivo: integrar Bootstrap (navbar, grid de cards, hero, footer).

        Commits sugeridos:

        feat: integrar Bootstrap CDN en proyecto

        feat: migrar navbar y hero a clases Bootstrap

        feat: maquetar cards de servicios con grid de Bootstrap

        style: ajustes personalizados en bootstrap-overrides.css

feature/forms-validation

        Objetivo: formularios (login, registro, contacto) con validación en HTML5 y mensajes dinámicos en JS.

        Commits sugeridos:

        feat: crear formulario de registro con validación HTML5

        feat: validar formulario de contacto con JS (mensajes de error)

        feat: validar login con JS y mostrar alertas

        style: personalizar estilos de formularios

feature/localstorage-reservas

        Objetivo: simular reservas/carrito usando localStorage.

        Commits sugeridos:

        feat: guardar reservas en localStorage

        feat: mostrar reservas almacenadas en página de usuario

        fix: corregir duplicados en reservas de localStorage

feature/darkmode-tooltips (opcional, pero queda precioso 👀)

        Objetivo: botón de modo oscuro + tooltips/alerts de Bootstrap.

        Commits sugeridos:

        feat: añadir toggle de modo oscuro con localStorage

        feat: integrar tooltips de Bootstrap en botones

        feat: mostrar toast de confirmación al reservar

🔄 Flujo de trabajo para cada feature

1.- Crear rama:

    git checkout -b feature/estructura-html


2.-Hacer cambios, probar.

3.-Commit y push:

    git add .
    git commit -m "feat: crear index.html con estructura semántica"
    git push -u origin feature/estructura-html


4.-En GitHub → abrir Pull Request hacia main.

5.-Revisar (tú misma), hacer merge a main.

6.-Crear la siguiente rama:

    git checkout main
    git pull origin main
    git checkout -b feature/bootstrap-layout

------------------------------------------------------
📌 Paso 1 — Crear la nueva rama de feature

Desde tu terminal, estando en la carpeta del proyecto:

git checkout main        # asegurarte de estar en main
git pull origin main     # traerte la última versión de GitHub
git checkout -b feature/estructura-html

📌 Paso 2 — Hacer los primeros cambios

En esta rama vas a dejar listo el esqueleto de todas las páginas (aunque estén vacías).

-index.html

-productos.html

-producto.html

-blogs.html

--blog-detalle.html

-nosotros.html

-contacto.html

-login.html

-registro.html

Con solo <header>, <main> y <footer> ya cumple para el primer commit.

📌 Paso 3 — Primer commit con estilo pro
git add .
git commit -m "feat: crear estructura base de páginas (HTML semántico)"


🔑 Convención usada:

feat: = nueva funcionalidad.

fix: = corrección de bug.

style: = cambios de diseño/CSS sin lógica.

chore: = tareas de configuración o limpieza.

📌 Paso 4 — Subir la rama a GitHub
git push -u origin feature/estructura-html


Ahora en tu repo aparecerá la rama nueva. 🎉

📌 Paso 5 — Pull Request

Entra a GitHub → verás un aviso tipo “feature/estructura-html had recent pushes. Compare & pull request”.

Abres un Pull Request (PR) hacia main.

Puedes escribir un resumen profesional, ejemplo:

✨ Estructura inicial

Se crean todas las páginas requeridas (index, productos, blogs, etc.).

Se incluye HTML semántico mínimo (header, main, footer).

Le das Merge.

📌 Paso 6 — Continuar con nuevas ramas

Cada vez que termines una parte:

Regresa a main:

git checkout main
git pull origin main


Crea una nueva rama de feature:

git checkout -b feature/bootstrap-layout


✅ Con esto tu repo se verá profesional y colaborativo, aunque trabajes sola.