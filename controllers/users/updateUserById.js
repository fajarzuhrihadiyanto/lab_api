const { body } = require('express-validator')

const db = require('../../db')

exports.updateUserByIdValidationHandlers = [
    body('username')
      .notEmpty().withMessage('Username cannot be empty').optional({values: 'undefined', checkFalsy: true}),
    body('fullname')
      .notEmpty().withMessage('Username cannot be empty').optional({values: 'undefined', checkFalsy: true}),
    body('role_id')
      .notEmpty().withMessage('role_id cannot be empty').optional({values: 'undefined', checkFalsy: true}),
    body('password')
      .isLength({ min: 8 }).withMessage('password must be 8 characters length minimum').optional({values: 'undefined', checkFalsy: true}),
  ]

exports.updateUserByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const { username, fullname, role_id, password } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check user existence ===========
        const reference = db.collection('Users').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const snapshotData = snapshot.data()
        //#endregion  //*======== Check user existence ===========

        // Update user
        const data = {
            username: username || snapshotData.username,
            fullname: fullname || snapshotData.fullname,
            role_id: role_id || snapshotData.role_id,
            password: password || snapshotData.password,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await reference.update({...data})

        res.status(200).json({
            message: 'Success',
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}