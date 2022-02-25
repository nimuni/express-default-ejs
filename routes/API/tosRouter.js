const express = require('express');
const router = express.Router();
const tosController = require(process.cwd()+ '/js/controller/tosController')
require('dotenv').config();

router.get('/', tosController.selectAll)
router.get('/required', tosController.selectRequiredAll)
router.get('/selection', tosController.selectSelectionAll)
router.get('/:id', tosController.selectOne)
router.post('/', tosController.insertOne)
router.put('/:id', tosController.updateOne)
router.delete('/:id', tosController.deleteOne)

module.exports = router;