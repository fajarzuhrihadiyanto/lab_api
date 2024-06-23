const { body, oneOf } = require('express-validator')

const db = require('../../db')

exports.addProfessorValidationHandlers = [
    body('NIDN')
        .isString().withMessage('name cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    body('fullname')
        .notEmpty().withMessage('general information cannot be empty'),
    oneOf([
        body('email')
            .isEmail().withMessage('email format is not valid').optional({ values: 'undefined', checkFalsy: true }),
        body('email').isLength({ min: 0, max: 0})
    ]),
    body('initial')
        .notEmpty().withMessage('initial cannot be empty'),
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty'),
    body('is_head_lab')
        .isBoolean().withMessage('is head lab must be a boolean').optional({ values: 'undefined', checkFalsy: true }),
    body('latest_education')
        .notEmpty().withMessage('latest education cannot be empty'),
    body('photo')
        .notEmpty().withMessage('photo url cannot be empty'),
    body('position')
        .isArray().withMessage('position must be an array'),
    body('position.*.name')
        .notEmpty().withMessage('position name cannot be empty'),
    body('position.*.from_year')
        .isNumeric().withMessage('position from year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('position.*.to_year')
        .isNumeric().withMessage('position to year must be a number').optional({ values: 'undefined', checkFalsy: true }),
    body('publication')
        .isObject().withMessage('publication must be an object'),
    oneOf([
        body('publication.scopus_id')
            .notEmpty().withMessage('scopus id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
        body('publication.google_scholar_id')
            .notEmpty().withMessage('google scholar id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
        body('publication.sinta_id')
            .notEmpty().withMessage('sinta id cannot be empty').optional({ values: 'undefined', checkFalsy: true }),
    ]),
]

exports.addProfessorController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const {
            NIDN,
            fullname,
            email,
            initial,
            lab_id,
            is_head_lab,
            latest_education,
            photo,
            position,
            publication
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

        //#region  //*=========== Check Role Lab ===========
        const roleRef = req.roles_snapshot.ref
        const roleLabSnapshot = await db.collection('Roles_labs').where('lab_id', '==', labRef).where('role_id', '==', roleRef).get()
        if (roleLabSnapshot.empty) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        const roleLabData = roleLabSnapshot.docs[0].data()
        if (roleLabData.is_write === false) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        //#endregion  //*======== Check Role Lab ===========

        //#region  //*=========== Upload photo to cloudinary ===========
        const cloudinary = require('../../cloudinary')
        const result = await cloudinary.uploader.upload(photo, {
            folder: `skripsi/${labSnapshot.data().alias}/dosen`
        })
        const photo_url = result.secure_url
        //#endregion  //*======== Upload photo to cloudinary ===========

        //#region  //*=========== Create new Professor ===========
        const newProfessor = (await (await db.collection('Professors').add({
            NIDN,
            fullname,
            email,
            initial,
            lab_id: labRef,
            is_head_lab,
            latest_education,
            photo_url,
            position,
            publication,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()).data()
        //#endregion  //*======== Create new professor ===========

        res.status(201).json({
            message: 'Success',
            data: {
                professor: {
                    ...newProfessor,
                    lab_id: newProfessor.lab_id.id,
                    created_at: newProfessor.created_at.toDate(),
                    updated_at: newProfessor.updated_at.toDate(),
                    created_by: newProfessor.created_by.id,
                    updated_by: newProfessor.updated_by.id,
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