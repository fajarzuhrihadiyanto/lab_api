const { body } = require('express-validator')

const db = require('../../db')

exports.addSubjectValidationHandlers = [
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty'),
    body('description')
        .notEmpty().withMessage('description cannot be empty'),
    body('is_compulsory')
        .isBoolean().withMessage('is compulsory must be a boolean'),
    body('name')
        .notEmpty().withMessage('name cannot be empty'),
    body('objective')
        .isArray().withMessage('objective must be an array'),
    body('objective.*')
        .notEmpty().withMessage('objective cannot be empty'),
]

exports.addSubjectController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const {
            lab_id,
            description,
            is_compulsory,
            name,
            objective
        } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check lab existence ===========
        const labRef = db.collection('Labs').doc(lab_id)
        const labSnapshot = await labRef.get()
        if (!labSnapshot.exists) {
            return res.status(404).json({
                message: 'Lab not found'
            })
        }
        //#endregion  //*======== Check lab existence ===========

        //#region  //*=========== Create new subject ===========
        const newSubject = (await (await db.collection('Subjects').add({
            lab_id: labRef,
            description,
            is_compulsory,
            name,
            objective,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()).data()
        //#endregion  //*======== Create new subject ===========

        res.status(201).json({
            message: 'Success',
            data: {
                subject: {
                    ...newSubject,
                    lab_id: newSubject.lab_id.id,
                    created_by: newSubject.created_by.id,
                    updated_by: newSubject.updated_by.id,
                    created_at: newSubject.created_at.toDate(),
                    updated_at: newSubject.updated_at.toDate(),
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