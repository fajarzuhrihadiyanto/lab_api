const { body } = require('express-validator')

const db = require('../../db')

exports.addCommunityServiceValidationHandlers = [
    body('community_service_type')
        .isString().withMessage('research type must be a string'),
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty'),
    body('professor_id')
        .isString().withMessage('professor id cannot be empty'),
    body('year')
        .isNumeric().withMessage('year must be a number'),
    body('title')
        .notEmpty().withMessage('title cannot be empty'),
]

exports.addCommunityServiceController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
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
        let professorRef
        if (professor_id) {
                professorRef = db.collection('Professors').doc(professor_id)
            const professorSnapshot = await professorRef.get()
            if (!professorSnapshot.exists) {
                return res.status(404).json({
                    message: 'Professor not found'
                })
            }
        }
        //#endregion  //*======== Check professor existence ===========

        //#region  //*=========== Create new community service ===========
        const newCommunityServiceSnapshot = (await (await db.collection('Community_services').add({
            community_service_type,
            lab_id: labRef,
            professor_id: professorRef,
            year,
            title,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get())
        const newCommunityService = newCommunityServiceSnapshot.data()
        //#endregion  //*======== Create new community service ===========

        res.status(201).json({
            message: 'Success',
            data: {
                community_service: {
                    ...newCommunityService,
                    id: newCommunityServiceSnapshot.id,
                    lab_id: newCommunityService.lab_id.id,
                    professor_id: newCommunityService.professor_id?.id,
                    created_at: newCommunityService.created_at.toDate(),
                    updated_at: newCommunityService.updated_at.toDate(),
                    created_by: newCommunityService.created_by.id,
                    updated_by: newCommunityService.updated_by.id,
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