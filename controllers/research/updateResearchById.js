const { body } = require('express-validator')

const db = require('../../db')

exports.updateResearchByIdValidationHandlers = [
    body('research_type').optional({ values: 'undefined', checkFalsy: true }),
    body('professor_id')
        .isString().withMessage('professor id must be a string').optional({ values: 'undefined', checkFalsy: true }),
    body('year')
        .isNumeric().withMessage('year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('title')
        .notEmpty().withMessage('title cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
]

exports.updateResearchByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const {
            research_type,
            professor_id,
            year,
            title
        } = req.body
        //#endregion  //*======== Parse request ===========

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

        //#region  //*=========== Check research existence ===========
        const researchReference = db.collection('Research').doc(id);
        const researchSnapshot = await researchReference.get();
        if (!researchSnapshot.exists) {
            return res.status(404).json({
                message: 'research not found'
            })
        }
        //#endregion  //*======== Check research existence ===========

        // Update research
        const data = {
            research_type,
            professor_id: professorRef,
            year,
            title,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await researchReference.update({...data})

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