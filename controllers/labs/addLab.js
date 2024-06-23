const { body } = require('express-validator')

const db = require('../../db')

exports.addLabValidationHandlers = [
    body('name')
        .notEmpty().withMessage('name cannot be empty'),
    body('alias')
        .notEmpty().withMessage('alias cannot be empty'),        
    body('general_information')
        .notEmpty().withMessage('general information cannot be empty'),
    body('website')
        .isString().withMessage('website must be a string'),
]

exports.addLabController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { name, alias, website, general_information } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Create new lab ===========
        const newLabSnapshot = (await (await db.collection('Labs').add({
            name,
            alias,
            website,
            general_information,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get())
        const newLab = newLabSnapshot.data()
        //#endregion  //*======== Create new lab ===========

        //#region  //*=========== Add role lab ===========
        const rolesSnapshot = await db.collection('Roles').get()
        if (!rolesSnapshot.empty) {
            await Promise.all(rolesSnapshot.docs.map(doc =>
                db.collection('Roles_labs').add({ 
                    is_write: doc.id === process.env.ADMIN_ID,
                    lab_id: newLabSnapshot.ref,
                    role_id: doc.ref,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user_snapshot.ref,
                    updated_by: req.user_snapshot.ref
                })
            ))
        }
        //#endregion  //*======== Add role lab ===========
        
        res.status(201).json({
            message: 'Success',
            data: {
                lab: {
                    ...newLab,
                    created_at: newLab.created_at.toDate(),
                    updated_at: newLab.updated_at.toDate(),
                    created_by: newLab.created_by.id,
                    updated_by: newLab.updated_by.id,
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