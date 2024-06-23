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
        const newFacilitySnapshot = await (await db.collection('Facilities').add({
            name,
            lab_id: labRef,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()
        const newFacility = newFacilitySnapshot.data()
        //#endregion  //*======== Create new facility ===========

        res.status(201).json({
            message: 'Success',
            data: {
                facility: {
                    ...newFacility,
                    id: newFacilitySnapshot.id,
                    created_at: newFacility.created_at.toDate(),
                    updated_at: newFacility.updated_at.toDate(),
                    created_by: newFacility.created_by.id,
                    updated_by: newFacility.updated_by.id,
                    lab_id: newFacility.lab_id.id
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