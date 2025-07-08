# t_p

## IMPORTANTE:
- BuscarProducto.js, CrearProducto.js, EliminarProducto.js, ListarProductos.js, ModificarProducto.js, validarToken.js y serverless.yml VAN EN UN SOLO LUGAR
- docker-compose.yml VA SOLO A LA MÁQUINA VIRTUAL MV BÚSQUEDA
- index.mjs ES UN LAMBDA SEPARADO, NO OLVIDAR GATILLARLO AL STREAM DE LA TABLA t_productos_${sls:stage}
- Producto-PROYECTO.postman_collection.json ES PARA PROBAR EN POSTMAN.

## PASOS:
- Hacer git clone en la VM del microservicio e ingresar a su directorio
- En el directorio, hacer "npm install aws-sdk"
- Finalmente se hace el sls deploy ahí
- Una vez tenido lo de arriba (lo del microservicio) hecho, CREAR LA MV Búsqueda
- Meter el docker-compose.yml ahí.
- Con la MV Búsqueda ya creada, ir a Lambda y crear ActualizarProducto.
- Ahí copiar y pegar lo de index.mjs Y CAMBIAR LA IP EN EL COMENTARIO AL DEL MV Búsqueda.
- EN TU LAPTOP LOCAL, CORRER npm install @elastic/elasticsearch @aws-sdk/util-dynamodb tslib, LO PONES EN UN ZIP Y LO GUARDAS DENTRO DE UN CONTENEDOR S3.
- Con el contenedor creado con el zip de node_modules, en el apartado de código, en Upload from, darle a Amazon S3 Location, y pegar la dirección del zip con las dependencias. DEBERÍA APARECER index.mjs y node_modules.
- Darle a Add Trigger que aparecerá en Function Overview, y enlazarlo a t_productos_${sls:stage}
- Darle a Deploy
- Una vez hecho esto, volver a MV Búsqueda y crear el un volumen con "docker volume create ElasticSearch"
- Hacer docker compose up -d
- Hacer curl -X PUT http://IP-DE-MV-BÚSQUEDA:9200/idx_productos
- Probar añadiendo productos, modificando y eliminando, hacer curl "http://IP-DE-MV-BÚSQUEDA:9200/idx_productos/_search?q=producto_id:producto2&pretty" cada vez que hagas un método.

## Métodos: Se puede probar en postman en el .postman_collection que está en este github
- POST ListarProductos
- POST CrearProducto
- POST BuscarProducto
- PUT ModificarProducto
- DELETE EliminarProducto

# Curls para MV Búsqueda con Elastic Search
- curl http://IP-DE-MV-BÚSQUEDA:9200/idx_productos/_search?q=producto_id:nuevo_id
- curl "http://IP-DE-MV-BÚSQUEDA:9200/idx_productos/_search?q=producto_id:producto2&pretty"
