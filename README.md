# Portfolio: despliegue y consultas

El sitio ahora incluye un formulario que guarda cada consulta como una linea JSON en `data/contactos.txt`. Para que funcione en produccion, despliega el proyecto como **Web Service de Node** en Render (puedes usar el `render.yaml` incluido), no como Static Site. El formulario requiere que la pagina y `/api/contacto` se sirvan desde el mismo servicio.

Render Free usa almacenamiento efimero: el archivo puede desaparecer al reiniciarse o desplegarse el servicio. Para conservar consultas de forma confiable, configura un disco persistente (si tu plan lo permite) con `DATA_DIR=/var/data`, o cambia el guardado a una base de datos persistente antes de depender de este canal para clientes.

Para consultar las consultas guardadas, Render genera `CONTACTS_VIEW_TOKEN` al crear el servicio. Usa el valor desde el panel de Render con una solicitud `GET /api/contactos` y el encabezado `Authorization: Bearer <token>`. El archivo de datos no se sirve como contenido publico.

En local: `npm start` y abre `http://localhost:3000`. El archivo local se crea en `data/contactos.txt`.

## Presentación y animaciones

Los estilos de las nuevas secciones están en `assets/css/experience.css` y su comportamiento en `assets/js/experience.js`. Se utiliza el Swiper que ya incluye el proyecto, sin agregar React ni dependencias de animación.

- Experiencia: tarjetas en orden cronológico, de la más antigua a la más reciente, con fecha y descripción. Al cambiar una fecha, actualizar la tarjeta en `index.html`, reordenarla y actualizar también el proyecto en `portfolio-details.html`.
- Detalles: cada `article.project-slide` contiene la imagen, fecha, cliente y descripción del mismo proyecto. Los enlaces con `?proyecto=...` abren directamente la tarjeta correspondiente.
- Templates: para sumar uno, duplicar un `article.template-card` dentro del `swiper-wrapper` de la sección `templates` y cambiar imagen, nombre y descripción. Los controles se ajustan a la cantidad de tarjetas.
- Próximamente: las imágenes 10, 11 y 12 se publican ya borrosas; el blur no depende de CSS.
- Los carruseles permiten avance manual, teclado, gestos y pausa. Las animaciones respetan la preferencia de movimiento reducido del navegador. El chat se reproduce al entrar en pantalla y se puede repetir con su botón.

## Imágenes de próximos proyectos

Los archivos públicos `assets/img/portfolio/product-10.png` a `product-12.png` son ahora versiones borrosas. Los originales se guardan localmente en `private-source-assets/`, carpeta excluida por `.gitignore`; el servidor Node también rechaza solicitudes a esa ruta. Para mantener los originales fuera del sitio publicado, despliega desde el repositorio Git y no copies `private-source-assets/` a un directorio público al subir el sitio manualmente.
