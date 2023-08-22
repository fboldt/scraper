const validateBody = (req, res, next) => {
    const { url } = req.body;

    if (url == undefined) {
        return res.status(400).json({ message: 'The field "url" is required' });
    }

    if (url == "") {
        return res.status(400).json({ message: 'Url cannot be empty' });
    }

    next();
}

module.exports = {
    validateBody
}