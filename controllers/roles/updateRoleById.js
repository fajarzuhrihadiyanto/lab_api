const { body } = require('express-validator')

const db = require('../../db')

exports.updateRoleByIdValidationHandlers = [
    body('name')
      .notEmpty().withMessage('name cannot be empty'),
]

exports.updateRoleByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const { name } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check role existence ===========
        const reference = db.collection('Roles').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Role not found'
            })
        }
        //#endregion  //*======== Check role existence ===========

        // Update role
        const data = {
            name,
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