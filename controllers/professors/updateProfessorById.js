const { body, oneOf } = require('express-validator')

const db = require('../../db')

exports.updateProfessorByIdValidationHandlers = [
    body('NIDN')
        .isString().withMessage('name cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('fullname')
        .notEmpty().withMessage('general information cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    oneOf([
        body('email')
            .isEmail().withMessage('email format is not valid').optional({ values: 'undefined', checkFalsy: true }),
        body('email').isLength({ min: 0, max: 0})
    ]),
    body('initial')
        .notEmpty().withMessage('initial cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('is_head_lab')
        .isBoolean().withMessage('is head lab must be a boolean').optional({ values: 'undefined', checkFalsy: true }),
    body('latest_education')
        .notEmpty().withMessage('latest education cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('photo_url')
        .notEmpty().withMessage('photo url cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('position')
        .isArray().withMessage('position must be an array').optional({ values: 'undefined', checkFalsy: true }),
    body('position.*.name')
        .notEmpty().withMessage('position name cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('position.*.from_year')
        .isNumeric().withMessage('position from year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('position.*.to_year')
        .isNumeric().withMessage('position to year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('publication')
        .isObject().withMessage('publication must be an object').optional({ values: 'undefined', checkFalsy: true }),
    body('publication.scopus_id')
        .notEmpty().withMessage('scopus id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('publication.google_scholar_id')
        .notEmpty().withMessage('google scholar id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('publication.sinta_id')
        .notEmpty().withMessage('sinta id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
]

exports.updateProfessorByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const {
            NIDN,
            fullname,
            email,
            initial,
            lab_id,
            is_head_lab,
            latest_education,
            photo_url,
            position,
            publication
        } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check professor existence ===========
        const professorReference = db.collection('Professors').doc(id);
        const professorSnapshot = await professorReference.get();
        if (!professorSnapshot.exists) {
            return res.status(404).json({
                message: 'Professor not found'
            })
        }
        //#endregion  //*======== Check professor existence ===========

        //#region  //*=========== Check lab existence ===========
        const labReference = db.collection('Labs').doc(lab_id);
        const labSnapshot = await labReference.get();
        if (!labSnapshot.exists) {
            return res.status(404).json({
                message: 'Lab not found'
            })
        }
        //#endregion  //*======== Check lab existence ===========

        // Update professor
        const data = {
            NIDN,
            fullname,
            email,
            initial,
            lab_id: labReference,
            is_head_lab,
            latest_education,
            photo_url,
            position,
            publication,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await professorReference.update({...data})

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