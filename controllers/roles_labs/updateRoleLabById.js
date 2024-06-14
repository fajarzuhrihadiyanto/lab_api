const { body } = require('express-validator')

const db = require('../../db')

exports.updateRoleLabByIdValidationHandlers = [
    body('is_write')
        .isBoolean().withMessage('is write must be a boolean value'),
]

exports.updateRoleLabByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const { is_write } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check role lab existence ===========
        const reference = db.collection('Roles_labs').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Role not found'
            })
        }
        //#endregion  //*======== Check role lab existence ===========

        // Update role lab
        const data = {
            is_write,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await reference.update({...data})

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