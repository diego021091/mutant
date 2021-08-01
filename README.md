
# Mutant
Microservicio que identifica si un humano es mutante o no por medio de su cadena de ADN. También devuelve las estadisticas de las cadenas de ADN

# Instrucciones de como verificar una cadena de ADN.
Para ejecutar el API, se debe hacer un llamado **HTTPS** con el metodo **POST** a la siguiente ruta:

`URL`: [https://2ekuqbt0z5.execute-api.us-east-1.amazonaws.com/dev/mutant](https://2ekuqbt0z5.execute-api.us-east-1.amazonaws.com/dev/mutant)

El microservicio espera un request body, con la siguiente estructura

**Request**
~~~
{
    
    "dna":["ATGCGA","CTGTAC","TTATGT","AGAAGG","CCCCTA","TCACTG"]

} 
~~~
**Response cuando es mutante**
~~~
{
    "isMutant": true,
    "message": "Es Mutante"
}
~~~
status code: 200 OK

**Response cuando no es mutante**

~~~
{
    "message": "No es mutante"
}
~~~
status code: 403 Forbidden

# Instrucciones para devolver las estadisticas de las cadenas de ADN consultadas 
Para ejecutar el API, se debe hacer un llamado **HTTPS** con el metodo **GET** a la siguiente ruta:

`URL`: [https://2ekuqbt0z5.execute-api.us-east-1.amazonaws.com/dev/stats](https://2ekuqbt0z5.execute-api.us-east-1.amazonaws.com/dev/stats)

**Response**
~~~
{
    "count_mutant_dna": 5,
    "count_human_dna": 10,
    "ratio": 0.5
}
~~~

# Instalación
### Requisitos
Instalar los siguientes programas:

- [Node 12.x](http://nodejs.org)
- [Serverless 2.52.x](https://serverless.com/)
- Configurar su AWS Access Key
- [Visual Studio Code](https://code.visualstudio.com/)
- [Postman](https://www.getpostman.com/downloads/)

#### Descargar, instalar y desplegar microservicio

 1. **Clonar repositorio:**

```sh
	git clone https://github.com/diego021091/mutant.git
```
 2. **Descargar dependencias:**
```sh
	npm install
```

 3. **Desplegar mircroservicio en AWS:**

```sh
	serverless deploy --stage dev --region us-east-1 --account yourAccount --verbose
```
**Nota:** En la variable **yourAccount** se reemplaza por el número de su cuenta de AWS

 4. **Ejecutar pruebas y cobertura:**
```sh
	npm run test
