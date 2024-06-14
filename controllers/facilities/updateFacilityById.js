const { body } = require('express-validator')

const db = require('../../db')

exports.updateFacilityByIdValidationHandlers = [
    body('name')
        .notEmpty().withMessage('name cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
]

exports.updateFacilityByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const { name } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check facility existence ===========
        const facilityReference = db.collection('Labs').doc(id);
        const facilitySnapshot = await facilityReference.get();
        if (!facilitySnapshot.exists) {
            return res.status(404).json({
                message: 'Facility not found'
            })
        }
        //#endregion  //*======== Check facility existence ===========

        // Update facility
        const data = {
            name,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await facilityReference.update({...data})

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