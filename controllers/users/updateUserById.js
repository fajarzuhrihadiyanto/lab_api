const { body } = require('express-validator')
const bcrypt = require('bcryptjs')

const db = require('../../db')

exports.updateUserByIdValidationHandlers = [
    body('username')
        .notEmpty().withMessage('Username cannot be empty').optional(),
    body('fullname')
        .notEmpty().withMessage('Username cannot be empty').optional(),
    body('role_id')
        .notEmpty().withMessage('role_id cannot be empty').optional(),
    body('password')
        .isLength({ min: 8 }).withMessage('password must be 8 characters length minimum').optional(),
    body('password2')
        .isLength({ min: 8 }).withMessage('password must be 8 characters length minimum').optional(),
  ]

exports.updateUserByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const { username, fullname, role_id, password, password2 } = req.body
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

        //#region  //*=========== Check if password is the same as confirm password ===========
        let hashedPassword
        if (password && password2) {
            if (password !== password2) {
                return res.status(422).json({
                messages: 'passwords are not the same'
                })
            }
            hashedPassword = await bcrypt.hash(password, 12)
        }
        
        //#endregion  //*======== Check if password is the same as confirm password ===========

        // Update user
        const data = {
            username: username || snapshotData.username,
            fullname: fullname || snapshotData.fullname,
            role_id: role_id ? db.collection('Roles').doc(role_id) : snapshotData.role_id,
            password: hashedPassword || snapshotData.password,
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