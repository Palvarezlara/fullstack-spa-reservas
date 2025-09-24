# 🌿 SPA del Bosque

Proyecto web estático desarrollado con **HTML5, CSS3, Bootstrap 5 y JavaScript**.  
Simula un sitio para un SPA con catálogo de servicios, carrito de compras y agenda de reservas.

---

## 🚀 Tecnologías usadas
- **HTML5**: estructura semántica de todas las páginas.
- **CSS3**: estilos personalizados y overrides de Bootstrap.
- **Bootstrap 5.3**: grid, navbar, componentes de UI responsivos.
- **JavaScript (ESM)**: lógica de carrito, validaciones de formularios y modal de agendamiento.
- **LocalStorage**: simulación de carrito/reservas.

---

## 📂 Estructura de carpetas
├── index.html
├── productos.html
├── producto.html
├── blogs.html
├── blog-detalle.html
├── nosotros.html
├── contacto.html
├── login.html
├── registro.html
├── css/
│ └── styles.css
├── js/
│ ├── agenda.js
| ├── app.js
| ├── auth-mocks.js
│ ├── carrito-page.js
│ ├── carrito.js
│ ├── contacto.js
│ ├── data.js
│ ├── login.js
│ ├── producto.js
│ ├── registro.js
│ └── session-ui.js
├── img/
└── README.md


---

## ⚡ Funcionalidades principales

- **Navbar + Footer responsivos**  
- **Catálogo de servicios (productos)** con cards Bootstrap.  
- **Página detalle del producto** con opción de:  
  - Agregar al carrito  
  - Agendar servicio (modal)  
- **Carrito de compras** con contador dinámico.  
- **Validación de formularios** (login, registro, contacto).  
- **Reserva/agenda** persistida en `localStorage`.  
- **Tooltips/toasts** (opcional).  

---

## 🔑 Convención de commits

- `feat:` nueva funcionalidad  
- `fix:` corrección de bug  
- `style:` cambios de diseño/estilo  
- `chore:` tareas menores de mantenimiento  
- `docs:` documentación  

Ejemplo:
```bash
git commit -m "feat: agregar validación de login con JS"
