const { body } = require('express-validator')

const db = require('../../db')

exports.addResearchValidationHandlers = [
    body('research_type')
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

exports.addResearchController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const {
            research_type,
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

        //#region  //*=========== Create new research ===========
        const newResearch = (await (await db.collection('Research').add({
            research_type,
            lab_id: labRef,
            professor_id: professorRef,
            year,
            title,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()).data()
        //#endregion  //*======== Create new research ===========

        res.status(201).json({
            message: 'Success',
            data: {
                research: {
                    ...newResearch,
                    id: newResearch.id,
                    lab_id: newResearch.lab_id.id,
                    professor_id: newResearch.professor_id?.id,
                    created_at: newResearch.created_at.toDate(),
                    updated_at: newResearch.updated_at.toDate(),
                    created_by: newResearch.created_by.id,
                    updated_by: newResearch.updated_by.id,
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