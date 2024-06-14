const { body } = require('express-validator')

const db = require('../../db')

exports.addLabValidationHandlers = [
    body('name')
        .notEmpty().withMessage('name cannot be empty'),
    body('general_information')
        .notEmpty().withMessage('general information cannot be empty'),
]

exports.addLabController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { name, general_information } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Create new lab ===========
        const newLab = (await (await db.collection('Labs').add({
            name,
            general_information,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()).data()
        //#endregion  //*======== Create new lab ===========

        res.status(201).json({
            message: 'Success',
            data: {
                role: {
                    ...newLab,
                    created_at: newLab.created_at.toDate(),
                    updated_at: newLab.updated_at.toDate(),
                    created_by: newLab.created_by.id,
                    updated_by: newLab.updated_by.id,
                }
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}