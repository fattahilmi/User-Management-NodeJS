const mysql = require('mysql2');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

// View users
exports.view = (req, res, next) => {
    // conn to db
    pool.getConnection((err, conn) => {
        if(err) {
            console.error(err)
        }
        console.log('Connected as ID ' + conn.threadId)

        // User the connect
        conn.query('select * from user where status = "active"', (err, rows) => {
            // When done with the connection, release it
            conn.release();

            if (!err) {
                res.render('home', { rows })
            } else {
                console.log('err')
            }
        })
    })
}

// find user by search
exports.find = (req, res) => {
     // conn to db
     pool.getConnection((err, conn) => {
        if(err) {
            console.error(err)
        }
        console.log('Connected as ID ' + conn.threadId)

        let searchTerm = req.body.search
        // User the connect
        conn.query('select * from user where first_name like ? or last_name like ?', 
        ['%' + searchTerm + '%', '%' + searchTerm + '%'], 
        (err, rows) => {
            // When done with the connection, release it
            conn.release();

            if (!err) {
                res.render('home', { rows })
            } else {
                console.log('err')
            }
        })
    })
}

// add user page
exports.form = (req, res) => {
    res.render('add-user')
}

// add new user
exports.adduser = (req, res) => {
    const { first_name, last_name, email, phone, comment } = req.body

    // conn to db
    pool.getConnection((err, conn) => {
    if(err) {
        console.error(err)
    }
    console.log('Connected as ID ' + conn.threadId)

    // User connect
    conn.query('insert into user set id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, comment = ?',
    [uuidv4(), first_name, last_name, email, phone, comment],
    (err, rows) => {
        // When done with the connection, release it
        conn.release();
        if (!err) {
            res.render('add-user', { alert: 'User added successfully!' })
        } else {
            res.status(500).json(err)
        }
        })
    })
}

exports.formEdit = (req, res) => {
    pool.getConnection((err, conn) => {
        conn.query('select * from user where id = ?',
        [req.params.id],
        (err, rows) => {
            // When done with the connection, release it
            conn.release();
            if (!err) {
                res.render('edit-user', { rows })
            } else {
                res.status(500).json(err)
            }
        })
    })
}

// update or edit user
exports.edit = (req, res) => {
    const { first_name, last_name, email, phone, comment } = req.body

    // conn to db
    pool.getConnection((err, conn) => {
        // User connect
        conn.query('update user set first_name = ?, last_name = ?, email = ?, phone = ?, comment = ? where id = ?',
        [first_name, last_name, email, phone, comment, req.params.id],
        (err, rows) => {
            // When done with the connection, release it
            conn.release();
            if (!err) {
                pool.getConnection((err, conn) => {
                    conn.query('select * from user where id = ?',
                    [req.params.id],
                    (err, rows) => {
                        // When done with the connection, release it
                        conn.release();
                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated` });
                        } else {
                            res.status(500).json(err)
                        }
                    })
                })
            } else {
                res.status(500).json(err)
            }
        })
    })
}


exports.delete = (req, res) => {
    pool.getConnection((err, conn) => {
        conn.query('delete from user where id = ?',
        [req.params.id],
        (err) => {
            // When done with the connection, release it
            conn.release();
            if (!err) {
                res.redirect('/')
            } else {
                res.status(500).json(err)
            }
        })
    })
}

// view user detail by id
exports.viewUser = (req, res, next) => {
    // conn to db
    pool.getConnection((err, conn) => {
        if(err) {
            res.status(500).json(err)
        }

        // User the connect
        conn.query('select * from user where id = ?', [req.params.id], (err, rows) => {
            // When done with the connection, release it
            conn.release();

            if (!err) {
                res.render('view-user', { rows })
            } else {
                console.log('err')
            }
        })
    })
}