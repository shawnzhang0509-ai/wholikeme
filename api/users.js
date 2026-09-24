const { demoProfile } = require('./mock-data')
module.exports = (req, res) => res.status(200).json({ demo: true, user: demoProfile })
