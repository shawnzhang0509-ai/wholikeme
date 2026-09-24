function ok(res, data, status = 200) { return res.status(status).json({ ok: true, ...data }) }
function bad(res, message, status = 400) { return res.status(status).json({ ok: false, error: message }) }
module.exports = { ok, bad }
