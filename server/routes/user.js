const express = require('express')
const userController = require('../controllers/userController.js')

const router = express.Router()

router.get('/', userController.view)
router.post('/', userController.find)
router.get('/adduser', userController.form)
router.post('/adduser', userController.adduser)
router.get('/edit/:id', userController.formEdit)
router.post('/edit/:id', userController.edit)
router.get('/:id', userController.delete)
router.get('/view/:id', userController.viewUser)

module.exports = router