# t_p

## PASOS:
- Hacer git clone en la VM e ingresar a su directorio
- En el directorio, correr "npm init -y"
- Después correr "npm install aws-sdk"
- Finalmente se hace el sls deploy

## Métodos: Se puede probar en postman en el .postman_collection que está en este github
- POST ListarProductos
- POST CrearProducto
- POST BuscarProducto
- PUT ModificarProducto
- DELETE EliminarProducto


## Extra:
- Crear MV Busqueda y ahí hacer lo de abajo.
- Hacer docker volume create ElasticSearch
- docker compose up -d

- curl -X PUT http://3.85.39.193:9200/idx_productos
- curl http://3.85.39.193:9200/idx_productos/_search?q=producto_id:nuevo_id
- curl http://3.85.39.193:9200
