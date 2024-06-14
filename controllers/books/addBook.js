const { body } = require('express-validator')

const db = require('../../db')

exports.addBookValidationHandlers = [
    body('ISBN')
        .isString().withMessage('ISBN must be string'),
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty'),
    body('professor_id')
        .isString().withMessage('professor id must be string'),
    body('release_city')
        .notEmpty().withMessage('release city cannot be empty'),
    body('release_year')
        .isNumeric().withMessage('release year must be a number'),
    body('title')
        .notEmpty().withMessage('title cannot be empty'),
]

exports.addBookController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const {
            lab_id,
            professor_id,
            release_city,
            release_year,
            title,
            ISBN
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

        //#region  //*=========== Create new book ===========
        const newBook = (await (await db.collection('Books').add({
            ISBN,
            lab_id: labRef,
            professor_id: professorRef,
            release_city,
            release_year,
            title,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()).data()
        //#endregion  //*======== Create new book ===========

        res.status(201).json({
            message: 'Success',
            data: {
                book: {
                    ...newBook,
                    lab_id: newBook.lab_id.id,
                    professor_id: newBook.professor_id?.id,
                    created_at: newBook.created_at.toDate(),
                    updated_at: newBook.updated_at.toDate(),
                    created_by: newBook.created_by.id,
                    updated_by: newBook.updated_by.id,
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