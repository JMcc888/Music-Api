const express = require('express');
const router = express.Router();

const  { getDecade, getDecades, createDecade, updateDecade, deleteDecade} = require('../controllers/decades')

router.route('/').get(getDecades).post(createDecade)
router.route('/:id').get(getDecade).put(updateDecade).delete(deleteDecade)

module.exports = router