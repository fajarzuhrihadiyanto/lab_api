const { body } = require('express-validator')

const db = require('../../db')

exports.updateBookByIdValidationHandlers = [
    body('ISBN')
        .isString().withMessage('ISBN must be a string').optional({ values: 'undefined', checkFalsy: true }),
    body('professor_id')
        .notEmpty().withMessage('professor id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('release_city')
        .notEmpty().withMessage('release city cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('release_year')
        .isNumeric().withMessage('release year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('title')
        .notEmpty().withMessage('title cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
]

exports.updateBookByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const {
            ISBN,
            professor_id,
            release_city,
            release_year,
            title
        } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check professor existence ===========
        const professorRef = db.collection('Professors').doc(professor_id)
        const professorSnapshot = await professorRef.get()
        if (!professorSnapshot.exists) {
            return res.status(404).json({
                message: 'Professor not found'
            })
        }
        //#endregion  //*======== Check professor existence ===========

        //#region  //*=========== Check book existence ===========
        const bookReference = db.collection('Books').doc(id);
        const bookSnapshot = await bookReference.get();
        if (!bookSnapshot.exists) {
            return res.status(404).json({
                message: 'Book not found'
            })
        }
        //#endregion  //*======== Check book existence ===========

        // Update book
        const data = {
            ISBN,
            professor_id: professorRef,
            release_city,
            release_year,
            title,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await bookReference.update({...data})

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