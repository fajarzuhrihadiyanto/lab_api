const { body } = require('express-validator')

const db = require('../../db')

exports.addRoleValidationHandlers = [
    body('name')
        .notEmpty().withMessage('name cannot be empty'),
]

exports.addRoleController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { name } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Create new role ===========
        const newRoleSnapshot = (await (await db.collection('Roles').add({
            name,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get())
        const newRole = newRoleSnapshot.data()
        //#endregion  //*======== Create new role ===========

        //#region  //*=========== Add role lab ===========
        const labsSnapshot = await db.collection('Labs').get()
        if (!labsSnapshot.empty) {
            await Promise.all(labsSnapshot.docs.map(doc =>
                db.collection('Roles_labs').add({ 
                    is_write: false,
                    lab_id: doc.ref,
                    role_id: newRoleSnapshot.ref,
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
                role: {
                    ...newRole,
                    created_at: newRole.created_at.toDate(),
                    updated_at: newRole.updated_at.toDate(),
                    created_by: newRole.created_by.id,
                    updated_by: newRole.updated_by.id,
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