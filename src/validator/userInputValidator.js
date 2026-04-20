

import Joi from "joi";

export const userValidation = Joi.object({
    username: Joi.string().min(3).max(100).allow("").optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(16)
})


export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(16)
})

