const { body } = require('express-validator')

const db = require('../../db')

exports.updateCommunityServiceByIdValidationHandlers = [
    body('community_service_type').optional({ values: 'undefined', checkFalsy: true }),
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('professor_id')
        .notEmpty().withMessage('professor id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('year')
        .isNumeric().withMessage('year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('title')
        .notEmpty().withMessage('title cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
]

exports.updateCommunityServiceByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const {
            community_service_type,
            lab_id,
            professor_id,
            year,
            title
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

        //#region  //*=========== Check professor existence ===========
        const professorRef = db.collection('Labs').doc(professor_id)
        const professorSnapshot = await professorRef.get()
        if (!professorSnapshot.exists) {
            return res.status(404).json({
                message: 'Professor not found'
            })
        }
        //#endregion  //*======== Check professor existence ===========

        //#region  //*=========== Check community service existence ===========
        const communityServiceReference = db.collection('Community_services').doc(id);
        const communityServicekSnapshot = await communityServiceReference.get();
        if (!communityServicekSnapshot.exists) {
            return res.status(404).json({
                message: 'Community service not found'
            })
        }
        //#endregion  //*======== Check community service existence ===========

        // Update community service
        const data = {
            community_service_type,
            lab_id: labRef,
            professor_id: professorRef,
            year,
            title,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await communityServiceReference.update({...data})

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