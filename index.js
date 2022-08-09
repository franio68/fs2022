// ========= Tags de better-code =========
// ! Alerta
// ? Info
// TODO: Por hacer
// * Importante
// =======================================

// * Clase 6 - Creación de BDD de docentes, con rutas y validación
const Joi = require('joi'); // ! Joi con mayúsculas por tratarse de una clase

// ? Middleware
const morgan = require('morgan');
const helmet = require('helmet');

const logger = require('./logger');
const auth = require('./auth');
const express = require('express');
const gestorErroresMiddleware = require('./middleware/gestor-errores');

const rutasCursos = require('./routes/rutas-cursos'); // Importación de rutas

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

const port = 3000;
const cursos = [
	{
		id: 1,
		curso: 'Conceptos básicos GraphQL',
		docente: "Fran 'the Master' Dávila",
		precio: 5000,
	},
	{
		id: 2,
		curso: 'Conceptos básicos de Docker',
		docente: "Fran 'the Master' Dávila",
		precio: 5000,
	},
	{
		id: 3,
		curso: 'Master en Node.js',
		docente: "Fran 'the Master' Dávila",
		precio: 8000,
	},
];
const docentes = [
	{
		id: 1,
		nombre: 'Valka',
		apellidos: 'Dondarr',
		dni: '42.556.777-M',
		email: 'valka@sunmmail.com',
		password: 'valkita98?=',
	},
	{
		id: 2,
		nombre: 'Adrián',
		apellidos: 'Santos',
		dni: '43.123.444-B',
		email: 'adrian@sunmmail.com',
		password: 'adsan45*!',
	},
	{
		id: 3,
		nombre: 'Cristo',
		apellidos: 'Rey Santos',
		dni: '42.111.222-C',
		email: 'inri@sunmmail.com',
		password: 'inricrist0?¿=',
	},
	{
		id: 4,
		nombre: 'Lucifer',
		apellidos: 'Hell Hell',
		dni: '66.666.666-A',
		email: 'lucihell@sunmmail.com',
		password: '66666666',
	},
	{
		id: 5,
		nombre: 'Valdimiro',
		apellidos: 'Rebollo',
		dni: '41.544.778-O',
		email: 'vladi@sunmmail.com',
		password: 'vladiFuckYou4U,:*',
	},
	{
		id: 6,
		nombre: 'Lara',
		apellidos: 'Sanz',
		dni: '43.566.622-F',
		email: 'laraz@sunmmail.com',
		password: 'larili456',
	},
];

app.use(express.static('public'));

// app.use(logger); // ? Queda más claro el código y sabemos adonde tenemos que ir para saber lo que hace

// app.use(auth); // ? Lo mismo en esta ruta

//app.use('/api/cursos', rutasCursos);

app.get('/', (req, res) => {
	throw new Error('Not found');
	res.send('Respuesta desde servidor al acceso al endpoint /');
});

app.get('/api/cursos', (req, res) => {
	res.send(cursos);
});

app.get('/api/cursos/:id', (req, res) => {
	let idCurso = parseInt(req.params.id);
	const elCurso = cursos.find((curso) => {
		return curso.id === idCurso;
	});
	if (!elCurso) {
		res.status(404);
		res.send('No hemos encontrado un curso con ese id');
		//? También podemos escribir: res.status(404).send('No hemos encontrado...	)
	} else {
		res.send(elCurso);
	}
});

app.post('/api/cursos/', (req, res) => {
	// ? Destructuring para extraer solo el parámetro error del objeto devuelto por funcionDeValidacion
	const { error } = funcionDeValidacion(req.body);
	if (error) {
		console.log(error.details[0]); // * Vemos el error en el terminal de VS Code
		res
			.status(400) //! 400: Bad Request
			.send(error.details[0].message);
		return;
	}
	const nuevoCurso = {
		id: cursos.length + 1,
		curso: req.body.curso,
		docente: req.body.docente,
		precio: req.body.precio,
	};
	cursos.push(nuevoCurso);
	res.status(200).send(cursos);
});

app.put('/api/cursos/:id', (req, res) => {
	// * Localizar el curso
	let idCurso = parseInt(req.params.id);
	const elCurso = cursos.find((curso) => {
		return curso.id === idCurso;
	});
	// * Si no existe devolver 404
	if (!elCurso) {
		res.status(404).send('No hemos encontrado un curso con ese id');
		return;
	}
	// * Validar el curso
	// ? Destructuring para extraer solo el parámetro error del objeto devuelto por funcionDeValidacion
	const { error } = funcionDeValidacion(req.body);
	if (error) {
		console.log(error.details[0]); // * Vemos el error en el terminal de VS Code
		res
			.status(400) //! 400: Bad Request
			.send(error.details[0].message);
		return;
	}
	// * Actualizar el curso
	elCurso.curso = req.body.curso;
	elCurso.docente = req.body.docente;
	elCurso.precio = req.body.precio;
	// * Devolver al cliente el curso actualizado
	res.status(200).send(elCurso);
});

app.delete('/api/cursos/:id', (req, res) => {
	// * Localizar el curso
	let idCurso = parseInt(req.params.id);
	const elCurso = cursos.find((curso) => {
		return curso.id === idCurso;
	});
	// * Si no existe devolver 404
	if (!elCurso) {
		res.status(404).send('No hemos encontrado un curso con ese id');
		return;
	}
	// * Eliminar el curso
	const posicion = cursos.indexOf(elCurso);
	cursos.splice(posicion, 1);
	// * Devolver el curso ya borrado al cliente a modo de comprobación
	res.status(200).send(elCurso);
});

const funcionDeValidacion = (curso) => {
	const schema = Joi.object({
		// * reglas de validación
		id: Joi.number().min(1).max(50),
		curso: Joi.string().min(3).required(),
	});
};

// * Listar todos los docentes en la BDD
app.get('/api/docentes', (req, res) => {
	res.json({
		message: 'Todo correcto',
		docentes: docentes,
	});
});

// * Listar un docente en concreto por su id
app.get('/api/docentes/:id', (req, res) => {
	let idDocente = parseInt(req.params.id);
	const elDocente = docentes.find((docente) => {
		return docente.id === idDocente;
	});
	if (!elDocente) {
		res.status(404);
		res.send('No hemos encontrado un curso con ese id');
		//? También podemos escribir: res.status(404).send('No hemos encontrado...	)
	} else {
		res.json({
			mensaje: 'Docente solicitado',
			docente: elDocente,
		});
	}
});

// * Añadir un nuevo docente a la BDD
// TODO: Falta añadir validación de datos
app.post('/api/docentes/', (req, res) => {
	// ? Destructuring para extraer solo el parámetro error del objeto devuelto por funcionDeValidacion
	// const { error } = funcionDeValidacion(req.body);
	// if (error) {
	// 	console.log(error.details[0]); // * Vemos el error en el terminal de VS Code
	// 	res
	// 		.status(400) //! 400: Bad Request
	// 		.send(error.details[0].message);
	// 	return;
	// }
	const nuevoDocente = {
		id: docentes.length + 1,
		nombre: req.body.nombre,
		apellidos: req.body.apellidos,
		dni: req.body.dni,
		email: req.body.email,
		password: req.body.password,
	};
	docentes.push(nuevoDocente);
	res.status(201).json({
		mensaje: 'Docente creado en la base de datos',
		docente: nuevoDocente,
	});
});

// * Modificar datos de un Docente
app.put('/api/docentes/:id', (req, res) => {
	// * Localizar el docente
	let idDocente = parseInt(req.params.id);
	const elDocente = docentes.find((docente) => {
		return docente.id === idDocente;
	});
	// * Si no existe devolver 404
	if (!elDocente) {
		res.status(404).json({
			status: '404 Not Found',
			mensaje: 'No hemos encontrado un docente con ese id',
		});
		return;
	}
	// // * Validar el curso
	// // ? Destructuring para extraer solo el parámetro error del objeto devuelto por funcionDeValidacion
	// const { error } = funcionDeValidacion(req.body);
	// if (error) {
	// 	console.log(error.details[0]); // * Vemos el error en el terminal de VS Code
	// 	res
	// 		.status(400) //! 400: Bad Request
	// 		.send(error.details[0].message);
	// 	return;
	// }
	// * Actualizar el curso
	elDocente.nombre = req.body.nombre;
	elDocente.apellidos = req.body.apellidos;
	elDocente.dni = req.body.dni;
	elDocente.email = req.body.email;
	elDocente.password = req.body.password;
	// * Devolver al cliente el curso actualizado
	res.status(200).json({
		mensaje: `Se han actualizado los datos de ${req.body.nombre} ${req.body.apellidos}`,
		docente: elDocente,
	});
});
// * Eliminar un docente
app.delete('/api/docentes/:id', (req, res) => {
	// * Localizar el docente
	let idDocente = parseInt(req.params.id);
	const elDocente = docentes.find((docente) => {
		return docente.id === idDocente;
	});
	// * Si no existe devolver 404
	if (!elDocente) {
		res.status(404).send('No hemos encontrado un docente con ese id');
		return;
	}
	// * Eliminar el docente
	const posicion = docentes.indexOf(elDocente);
	docentes.splice(posicion, 1);
	// * Devolver el docente ya borrado al cliente a modo de comprobación
	res.status(200).json({
		status: 'eliminado',
		mensaje: `Se ha eliminado a ${elDocente.nombre} ${elDocente.apellidos} de la base de datos`,
	});
});

app.use(gestorErroresMiddleware);

app.listen(port, () => {
	console.log(`Servidor jolisniando 🐶 en el puerto http://localhost:${port}`);
});
