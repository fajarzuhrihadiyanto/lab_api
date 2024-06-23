const jwt = require('jsonwebtoken')
const { body } = require('express-validator')
const bcrypt = require('bcryptjs')

const db = require('../../db')

exports.loginValidationHandlers = [
  body('username')
    .notEmpty().withMessage('Username cannot be empty'),
  body('password')
    .isLength({ min: 8 }).withMessage('password must be 8 characters length minimum'),
]

exports.loginController =  async (req, res) => {
  try {
    //#region  //*=========== Parse request ===========
    const { username, password } = req.body
    //#endregion  //*======== Parse request ===========

    //#region  //*=========== Find user ===========
    const user_snapshot = await db.collection('Users').where('username', '==', username).get()
    if (user_snapshot.empty) {
      return res.status(401).json({
        message: 'Invalid authentication'
      })
    }
    const user = user_snapshot.docs[0].data()
    //#endregion  //*======== Find user ===========

    //#region  //*=========== Compare user password with given password ===========
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      return res.status(401).json({
        message: 'Invalid authentication'
      })
    }
    //#endregion  //*======== Compare user password with given password ===========
    
    //#region  //*=========== Update User Last Login ===========
    await user_snapshot.docs[0].ref.update({ last_login: new Date() })
    //#endregion  //*======== Update User Last Login ===========

    //#region  //*=========== Get Access ===========
    const access = []

    const roles_snapshot = await user.role_id.get()
    if (roles_snapshot.data().is_lab_write) {
      access.push({
        type: 'administrative',
        name: 'Laboratorium',
        url: 'laboratories'
      })
    }

    if (roles_snapshot.data().is_role_write) {
      access.push({
        type: 'administrative',
        name: 'Role',
        url: 'roles',
      })
    }

    if (roles_snapshot.data().is_user_write) {
      access.push({
        type: 'administrative',
        name: 'User',
        url: 'users',
      })
    }

    const roleLabSnapshot = await db.collection('Roles_labs').where('role_id', '==', roles_snapshot.ref).get()
    if (!roleLabSnapshot.empty) {
      // only add lab that has write access
      const labSnapshots = await Promise.all(
        roleLabSnapshot.docs
        .filter(doc => doc.data().is_write === true)
        .map((doc) => doc.data().lab_id.get())
      )

      labSnapshots.map((labSnapshot) => {
        const labData = labSnapshot.data()
        access.push({
          type: 'laboratory',
          lab_id: labSnapshot.id,
          name: labData.name,
          alias: labData.alias
        })
      })
    }

    //#endregion  //*======== Get Access ===========

    //#region  //*=========== Create JSON web token ===========
    const token = jwt.sign({ 
      user_id: user_snapshot.docs[0].id,
      access
    }, process.env.JWT_SECRET_KEY)
    return res.json({
      message: 'Sign in succeed',
      data: {
        user: {
          fullname: user.fullname,
          role: roles_snapshot.data().name,
        },
        token
      }
    })
    //#endregion  //*======== Create JSON web token ===========

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

