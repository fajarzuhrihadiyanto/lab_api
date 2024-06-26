const { body } = require('express-validator')

const db = require('../../db')

exports.updateSubjectByIdValidationHandlers = [
    body('description')
        .notEmpty().withMessage('professor id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('is_compulsory')
        .isBoolean().withMessage('is compulsory must be a boolean').optional({ values: 'undefined', checkFalsy: true }),
    body('name')
        .notEmpty().withMessage('name cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('objective')
        .isArray().withMessage('objective must be an array').optional({ values: 'undefined', checkFalsy: true }),
    body('objective.*')
        .notEmpty().withMessage('objective cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
]

exports.updateSubjectByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const {
            description,
            is_compulsory,
            name,
            objective
        } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check subject existence ===========
        const subjectReference = db.collection('Subjects').doc(id);
        const subjectSnapshot = await subjectReference.get();
        if (!subjectSnapshot.exists) {
            return res.status(404).json({
                message: 'subject not found'
            })
        }
        //#endregion  //*======== Check subject existence ===========

        // Update subject
        const data = {
            description,
            is_compulsory,
            name,
            objective,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await subjectReference.update({...data})

        res.status(200).json({
            message: 'Success'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}