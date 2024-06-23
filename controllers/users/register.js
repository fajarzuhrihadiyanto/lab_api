const { body } = require('express-validator')
const bcrypt = require('bcryptjs')

const db = require('../../db')

exports.registerValidationHandlers = [
  body('username')
    .notEmpty().withMessage('Username cannot be empty'),
  body('fullname')
    .notEmpty().withMessage('Full name cannot be empty'),
  body('password')
    .isLength({ min: 8 }).withMessage('password must be 8 characters length minimum'),
  body('password2')
    .isLength({ min: 8 }).withMessage('confirm password must be 8 characters length minimum'),
  body('role_id')
      .notEmpty().withMessage('role id cannot be empty'),
]

exports.registerController =  async (req, res) => {
  try {
    //#region  //*=========== Parse request ===========
    const {username, fullname, password, password2, role_id} = req.body
    //#endregion  //*======== Parse request ===========

    //#region  //*=========== Check if password is the same as confirm password ===========
    if (password !== password2) {
      return res.status(422).json({
        messages: 'passwords are not the same'
      })
    }
    //#endregion  //*======== Check if password is the same as confirm password ===========

    //#region  //*=========== Check role existence ===========
    const roleRef = db.collection('Roles').doc(role_id)
    const roleSnapshot = await roleRef.get()
    if (!roleSnapshot.exists) {
        return res.status(404).json({
            message: 'Role not found'
        })
    }
    //#endregion  //*======== Check role existence ===========
    
    //#region  //*=========== Find user by username ===========
    const user_snapshot = await db.collection('Users').where('username', '==', username).get()
    if (!user_snapshot.empty) {
      return res.status(200).json({
        message: 'username has been registered in this app'
      })
    }
    //#endregion  //*======== Find user by username ===========

    //#region  //*=========== Create new user ===========
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = (await (await db.collection('Users').add({
      username,
      fullname,
      password: hashedPassword,
      role_id: roleRef,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
      created_by: req.user_snapshot.ref,
      updated_by: req.user_snapshot.ref
    })).get()).data()
    //#endregion  //*======== Create new user ===========

    return res.status(201).json({
      message: 'User has been created',
      data: {
        user: {
          ...newUser,
          password: undefined,
          created_at: newUser.created_at.toDate(),
          updated_at: newUser.updated_at.toDate(),
          role_id: newUser.role_id.id,
          last_login: newUser.last_login.toDate(),
          created_by: newUser.created_by.id,
          updated_by: newUser.updated_by.id,
        }
      },
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}