const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Serever is up1')
}
)

module.exports = router