const joi = require('joi')

const articleValidationMiddleware = async function(req, res, next) {
    try {
        const articlePayload = req.body
        await articleValidator.validateAsync(articlePayload)
        next()
    } catch(err) {
        console.log(err)
        return res.status(406).json({error: err.details[0].message})
    }
}
const articleValidator = joi.object({
    title: joi.string()
              .required(),
    description: joi.string()
                    .optional(),
    tags: joi.string(),
    body: joi.string()
              .required()
            
})

module.exports = articleValidationMiddleware