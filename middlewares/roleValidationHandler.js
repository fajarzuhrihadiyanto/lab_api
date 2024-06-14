const jwt = require('jsonwebtoken')

const { ACCESS_ROLE, ACCESS_USER, ACCESS_LABORATORY } = require('../constant')
const db = require('../db')

module.exports = (method, access) => async (req, res, next) => {
    
    //#region  //*=========== Parse request ===========
    const authorization = req.headers.authorization
    //#endregion  //*======== Parse request ===========

    //#region  //*=========== Auth check ===========
    if (!authorization) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    //#endregion  //*======== Auth check ===========
    
    //#region  //*=========== Verify the given token ===========
    const token = authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    //#endregion  //*======== Verify the given token ===========

    //#region  //*=========== Find user role ===========
    const user_snapshot = await db.collection('Users').doc(decodedToken.user_id).get()
    if (!user_snapshot.exists) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const user = user_snapshot.data()
    // const role_id = user.role_id.id
    req.user_snapshot = user_snapshot
    //#endregion  //*======== Find user role ===========

    //#region  //*=========== Validate user role ===========
    // Get role 
    // const roles_snapshot = await db.collection('Roles').doc(role_id).get()

    // TODO: Check if this is work. if not, try to use the above code
    const roles_snapshot = await user.role_id.get()
    req.roles_snapshot = roles_snapshot

    // Check if this role has permission to access the lab object
    if (access === ACCESS_LABORATORY) {
        const role_object = roles_snapshot.data()

        if (['POST', 'PUT', 'DELETE'].includes(method) && !role_object.is_lab_write) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
    }

    // Check if this role has permission to access the role object
    if (access === ACCESS_ROLE) {
        const role_object = roles_snapshot.data()

        if (['POST', 'PUT', 'DELETE'].includes(method) && !role_object.is_role_write) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
    }
    
    // check if this role has permission to access the user object
    if (access === ACCESS_USER) {
        const role_object = roles_snapshot.data()

        if (['POST', 'PUT', 'DELETE'].includes(method) && !role_object.is_user_write) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
    }
    //#endregion  //*======== Validate user role ===========
  
    next()
  }