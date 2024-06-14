const { body } = require('express-validator')

const db = require('../../db')

exports.addRoleLabValidationHandlers = [
    body('lab_id')
        .notEmpty().withMessage('lab id cannot be empty'),
    body('role_id')
        .notEmpty().withMessage('role id cannot be empty'),
    body('is_write')
        .isBoolean().withMessage('is write must be a boolean value'),
]

exports.addRoleLabController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { lab_id, role_id, is_write } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check role existence ===========
    const roleRef = db.collection('Roles').doc(role_id)
    const roleSnapshot = await roleRef.get()
    if (!roleSnapshot.exists) {
        return res.status(404).json({
            message: 'Role not found'
        })
    }
    //#endregion  //*======== Check role existence ===========

        //#region  //*=========== Check lab existence ===========
        const labRef = db.collection('Labs').doc(lab_id)
        const labSnapshot = await labRef.get()
        if (!labSnapshot.exists) {
            return res.status(404).json({
                message: 'Lab not found'
            })
        }
        //#endregion  //*======== Check lab existence ===========

        //#region  //*=========== Create new role lab ===========
        const newRoleLab = (await (await db.collection('Roles_labs').add({
            lab_id: labRef,
            role_id: roleRef,
            is_write,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user_snapshot.ref,
            updated_by: req.user_snapshot.ref
        })).get()).data()
        //#endregion  //*======== Create new role lab ===========

        res.status(201).json({
            message: 'Success',
            data: {
                role_lab: {
                    ...newRoleLab,
                    role_id: newRoleLab.role_id.id,
                    lab_id: newRoleLab.lab_id.id,
                    created_at: newRoleLab.created_at.toDate(),
                    updated_at: newRoleLab.updated_at.toDate(),
                    created_by: newRoleLab.created_by.id,
                    updated_by: newRoleLab.updated_by.id,
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