exports.getDecades = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "Get decades"
    })
}

exports.getDecade = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `Get decade with id of ${req.params.id}`
    })
}

exports.updateDecade = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `Update decade with id of ${req.params.id}`
    })
}

exports.deleteDecade = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `Delete decade with id of ${req.params.id}`
    })
}

exports.createDecade = (req, res, next) => {
    res.status(201).json({
        success: true,
        data: "Create new decades"
    })
}