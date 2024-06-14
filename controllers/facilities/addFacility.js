const { body } = require('express-validator')

const db = require('../../db')

exports.addFacilityValidationHandlers = [
    body('name')
        .notEmpty().withMessage('name cannot be empty'),
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty'),
]

exports.addFacilityController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { name, lab_id } = req.body
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

        //#region  //*=========== Create new facility ===========
        const newFacility = await db.collection('Facilities').add({
            name,
            lab_id: labRef,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })
        //#endregion  //*======== Create new facility ===========

        res.status(201).json({
            message: 'Success',
            data: {
                facility: newFacility
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}