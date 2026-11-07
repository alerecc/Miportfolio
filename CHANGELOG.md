# Cambios del portfolio

## Modernizacion

- Se renovaron las secciones de servicios, perfil, habilidades, portfolio y contacto.
- Se amplio la oferta de desarrollo: tiendas, portales, aplicaciones, sistemas de turnos y gestion, pagos, integraciones, analytics, SEO y diseño digital.
- Se añadieron las herramientas y tecnologias declaradas por Alejo en una cinta continua con bordes en degradado, pausa manual, pausa al pasar el cursor y soporte para movimiento reducido.
- La cronologia presenta la experiencia y cada proyecto con fecha y descripción, ordenados del mas antiguo al mas reciente. La pagina de detalles usa un carrusel que presenta cada imagen junto a su cliente, fecha, descripción y enlace.
- Los templates tienen un carrusel propio. Tres proyectos próximos aparecen como adelantos con sus imagenes desenfocadas.
- La presentación del sistema de turnos usa mensajes animados y texto revelado. La foto de perfil tiene un efecto de inclinación.
- Se actualizaron los enlaces de Instagram, WhatsApp y correo. El número de teléfono abre WhatsApp y la dirección de correo abre el cliente de correo.

## Formulario de contacto y despliegue

- Se añadió un servidor Node sin dependencias externas para servir el sitio y guardar los formularios en `data/contactos.txt`.
- `POST /api/contacto` recibe consultas. `GET /api/contactos` requiere el token secreto `CONTACTS_VIEW_TOKEN` y devuelve las consultas guardadas.
- `render.yaml` configura un servicio Node de Render. En el plan gratuito, los archivos pueden perderse cuando el servicio se reinicia o vuelve a desplegarse; usa almacenamiento persistente o una base de datos si necesitas conservarlos.
- Las imagenes públicas `product-10.png` a `product-12.png` ya están desenfocadas. Sus versiones nitidas quedan localmente en `private-source-assets/`, ignorada por Git, y el servidor Node bloquea las solicitudes a esa ruta.

## Ejecución local

Requiere Node.js 20 o superior. Ejecuta `npm start` y abre `http://localhost:3000`.
