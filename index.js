const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const figlet = require('figlet')
const asciify = require('asciify-image')
const app = express()
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

const credentials = {
	host: 'database-predio.crczdb8916x6.us-east-2.rds.amazonaws.com',
	user: 'admin',
	password: '19802bb1p',
	database: 'predio'
}

app.get('/', (req, res) => {
	res.send('Hola, soy el servidor!')
})

app.post('/api/login', (req, res) => {
	const { username, password } = req.body;
	const values = [username];
	var connection = mysql.createConnection(credentials);

	connection.query("SELECT * FROM usuarios WHERE username = ?", values, (err, result) => {
		if (err) {
			res.status(500).send(err);
			connection.end();
			return;
		}

		if (result.length > 0) {
			const user = result[0];

			// Comparar la contraseña proporcionada con el hash almacenado
			bcrypt.compare(password, user.password, (compareErr, isMatch) => {
				if (compareErr) {
					res.status(500).send(compareErr);
					connection.end();
					return;
			 }

				if (isMatch) {
					res.status(200).send({
						"id": user.id,
						"user": user.user,
						"username": user.username,
						"picture": user.picture,
						"isAuth": true
					});
				} else {
					res.status(400).send('Credenciales incorrectas');
				}

				connection.end();
			});
		} else {
			res.status(400).send('Usuario no existe');
			connection.end();
		}
	});
});

// ...

app.get('/api/usuarios', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM usuarios', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
    connection.end();
});

app.post('/api/eliminar', (req, res) => {
    const { id } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('DELETE FROM usuarios WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Usuario Eliminado" });
        }
    });
    connection.end();
});

app.post('/api/guardar', (req, res) => {
    const { id, avatar, username, user, password, correo, carnet, rol, dpi, telefono, direccion } = req.body;

    // Encriptar la contraseña antes de almacenarla
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        const hashedPassword = hash;

        const params = [[id, avatar, username, user, hashedPassword, correo, carnet, rol, dpi, telefono, direccion]];
        var connection = mysql.createConnection(credentials);
        
        connection.query('INSERT INTO usuarios (id, avatar, username, user, password, correo, carnet, rol, dpi, telefono, direccion) VALUES ?', [params], (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({ "status": "success", "message": "Usuario creado" });
            }
        });

        connection.end();
    });
});

app.post('/api/editar', (req, res) => {
    const { id, avatar, username, user, password, correo, carnet, rol, dpi, telefono, direccion } = req.body;
    const params = [avatar, username, user, password, correo, carnet, rol, dpi, telefono, direccion, id];
    var connection = mysql.createConnection(credentials);
    connection.query('UPDATE usuarios SET avatar = ?, username = ?, user = ?, password = ?, correo = ?, carnet = ?, rol = ?, dpi = ?, telefono = ?, direccion = ? WHERE id = ?', params, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Usuario editado" });
        }
    });
    connection.end();
});


//////Marca

app.get('/api/marcas', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM marca', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
    connection.end();
});

app.get('/api/marca/select', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT marca FROM marca', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
    connection.end();
});

app.post('/api/marca/eliminar', (req, res) => {
    const { id } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('DELETE FROM marca WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Marca eliminada" });
        }
    });
    connection.end();
});

app.post('/api/marca/guardar', (req, res) => {
    const { id, Marca } = req.body;
    const params = [[id, Marca]];
    var connection = mysql.createConnection(credentials);
    connection.query('INSERT INTO marca (id, marca) VALUES ?', [params], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Marca creada" });
        }
    });
    connection.end();
});

app.post('/api/marca/editar', (req, res) => {
    const { id, Marca } = req.body;
    const params = [Marca, id];
    var connection = mysql.createConnection(credentials);
    connection.query('UPDATE marca SET marca = ? WHERE id = ?', params, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Marca editada" });
        }
    });
    connection.end();
});

///////tipo
app.get('/api/tipos', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM tipo', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
    connection.end();
});

app.get('/api/tiposS', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT linea FROM tipo', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
    connection.end();
});

app.post('/api/tipo/eliminar', (req, res) => {
    const { id } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('DELETE FROM tipo WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Tipo eliminado" });
        }
    });
    connection.end();
});

app.post('/api/tipo/guardar', (req, res) => {
    const { linea } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('INSERT INTO tipo (linea) VALUES (?)', [linea], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Tipo creado" });
        }
    });
    connection.end();
});

app.post('/api/tipo/editar', (req, res) => {
    const { id, linea } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('UPDATE tipo SET linea = ? WHERE id = ?', [linea, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Tipo editado" });
        }
    });
    connection.end();
});
////citas
app.get('/api/citas', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT cita.id AS id, cita.nombre, cita.correo, cita.telefono, cita.mensaje, cita.auto, cita.fecha, cita.hora, vehiculo.id AS vehiculo_id, vehiculo.marca, vehiculo.linea, vehiculo.modelo FROM cita INNER JOIN vehiculo ON cita.auto = vehiculo.id', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
        connection.end();
    });
});

app.get('/api/citas2', (req, res) => {
    var connection = mysql.createConnection(credentials);

    const sql = `
    SELECT ventas.id AS id, ventas.nombre, ventas.auto, ventas.fecha,  vehiculo.id AS vehiculo_id, vehiculo.marca, vehiculo.linea, vehiculo.modelo, vehiculo.color_exterior, vehiculo.numero_matricula, vehiculo.numero_motor, vehiculo.chasis FROM ventas INNER JOIN vehiculo ON ventas.auto = vehiculo.id

    `;

    connection.query(sql, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
        connection.end();
    });
});

app.post('/api/reg/eliminar', (req, res) => {
    const { id } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('DELETE FROM ventas WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "venta eliminada" });
        }
    });
    connection.end();
});


app.get('/api/reg', (req, res) => {
    var connection = mysql.createConnection(credentials);

    const sql = `
    SELECT registro.id AS id, registro.nombre, registro.correo, registro.telefono, registro.mensaje, registro.auto, registro.fecha, registro.hora, vehiculo.id AS vehiculo_id, vehiculo.marca, vehiculo.linea, vehiculo.modelo, vehiculo.color_exterior, vehiculo.numero_matricula, vehiculo.numero_motor, vehiculo.chasis FROM registro INNER JOIN vehiculo ON registro.auto = vehiculo.id

    `;

    connection.query(sql, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
        connection.end();
    });
});

app.post('/api/citas/eliminar', (req, res) => {
    const { id } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('DELETE FROM cita WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Cita eliminada" });
        }
        connection.end();
    });
});

app.post('/api/citas/crear', (req, res) => {
    const { nombre, correo, telefono, mensaje, auto } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('INSERT INTO cita (nombre, correo, telefono, mensaje, auto) VALUES (?, ?, ?, ?, ?)', [nombre, correo, telefono, mensaje, auto], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Cita creada" });
        }
        connection.end();
    });
});
/////////////////////////////////////
app.post('/api/citas/crearR', (req, res) => {
    const { id, nombre, correo, telefono, mensaje, auto, fecha, hora } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('INSERT INTO registro (id, nombre, correo, telefono, mensaje, auto, fecha, hora) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, nombre, correo, telefono, mensaje, auto, fecha, hora], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Cita creada" });
        }
        connection.end();
    });
});
/////////////////////////////////////////////////////////////////
app.post('/api/citas/crearV', (req, res) => {
  const { nombre, auto, fecha } = req.body;
  var connection = mysql.createConnection(credentials);
  
  connection.beginTransaction((err) => {
    if (err) {
      res.status(500).send(err);
      connection.end();
      return;
    }
  
    // Inserta el registro en la tabla 'ventas'
    connection.query(
      'INSERT INTO ventas (nombre, auto, fecha) VALUES (?, ?, ?)',
      [nombre, auto, fecha],
      (err, result) => {
        if (err) {
          connection.rollback(() => {
            res.status(500).send(err);
            connection.end();
          });
        } else {
          // Llama al procedimiento almacenado 'EliminarCitaDespuesInsert' con el ID del registro insertado
          connection.query('CALL EliminarCitaDespuesInsert(?)', [auto], (err) => {
            if (err) {
              connection.rollback(() => {
                res.status(500).send(err);
                connection.end();
              });
            } else {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    res.status(500).send(err);
                  });
                } else {
                  res.status(200).send({ "status": "success", "message": "Cita creada" });
                }
                connection.end();
              });
            }
          });
        }
      }
    );
  });
});


app.post('/api/citas/editar', (req, res) => {
    const { id, nombre, correo, telefono, mensaje, auto } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('UPDATE cita SET nombre = ?, correo = ?, telefono = ?, mensaje = ?, auto = ? WHERE id = ?', [nombre, correo, telefono, mensaje, auto, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Cita editada" });
        }
        connection.end();
    });
});

app.post('/api/citas/email', (req, res) => {
    // Aquí obtienes los datos del cuerpo de la solicitud
    const { nombre, correo,  mensaje } = req.body;

    // Luego, puedes ejecutar el código para enviar un correo utilizando emailjs.sendForm
    emailjs.sendForm('service_cvz0wu8', 'template_maipbes', form.current, 'mZIJiHooh3_oOUL7N')
        .then((result) => {
            console.log(result.text);
            res.status(200).send({ "status": "success", "message": "Cita creada" });
        })
        .catch((error) => {
            console.log(error.text);
            res.status(500).send({ "status": "error", "message": "Error al enviar el correo" });
        });
});


//////vehiculos

app.get('/api/vehiculos', (req, res) => {
    var connection = mysql.createConnection(credentials);
    connection.query('SELECT * FROM vehiculo', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
    connection.end();
});


app.post('/api/eliminar/vehiculo', (req, res) => {
    const { id } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('DELETE FROM vehiculo WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Vehículo eliminado" });
        }
    });
    connection.end();
});


app.post('/api/guardar/vehiculo', (req, res) => {
    const {linea, marca, modelo, ano, kilometraje, combustible, color_exterior, color_interior, numero_matricula, estado, transmision, numero_motor, chasis, precio_venta, url} = req.body;
    const params = [[linea, marca, modelo, ano, kilometraje, combustible, color_exterior, color_interior, numero_matricula, estado, transmision, numero_motor, chasis, precio_venta, url]];
    var connection = mysql.createConnection(credentials);
    connection.query('INSERT INTO vehiculo (linea, marca, modelo, ano, kilometraje, combustible, color_exterior, color_interior, numero_matricula, estado, transmision, numero_motor, chasis, precio_venta, url) VALUES ?', [params], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Vehiculo creado" });
        }
    });
    connection.end();
});

app.post('/api/editar/vehiculo', (req, res) => {
    const { id, linea, marca, modelo, ano, kilometraje, combustible, color_exterior, color_interior, numero_matricula, estado, transmision, numero_motor, chasis, precio_venta, url } = req.body;
    var connection = mysql.createConnection(credentials);
    connection.query('UPDATE vehiculo SET linea = ?, marca = ?, modelo = ?, ano = ?, kilometraje = ?, combustible = ?, color_exterior = ?, color_interior = ?, numero_matricula = ?, estado = ?, transmision = ?, numero_motor = ?, chasis = ?, precio_venta = ?, url = ? WHERE id = ?', [linea, marca, modelo, ano, kilometraje, combustible, color_exterior, color_interior, numero_matricula, estado, transmision, numero_motor, chasis, precio_venta, url, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ "status": "success", "message": "Vehículo editado" });
        }
    });
    connection.end();
});



////Server
app.listen(4000, async () => {
	const ascified = await asciify('helmet.png', { fit: 'box', width: 10, height: 10 })
	console.log(ascified)
	console.log(figlet.textSync('Grupo#3 Server v. 1.0.0'))
})
