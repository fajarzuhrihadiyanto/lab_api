const { body } = require("express-validator");
const db = require("../../db");

exports.updateAccessByRoleIdValidationHandlers = [
    body('access')
        .isArray().withMessage('access must be an array')
        .notEmpty().withMessage('access cannot be empty'),
    body('access.*')
        .isObject().withMessage('access data must be an object'),
    body('access.*.lab_id')
        .isString().withMessage('lab id must be a string'),
    body('access.*.is_write')
        .isBoolean().withMessage('is write must be a boolean')        
]

exports.updateAccessByRoleIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { role_id } = req.params
        const { access } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check role existence ===========
        const roleRef = db.collection('Roles').doc(role_id);
        const roleSnapshot = await roleRef.get();
        if (!roleSnapshot.exists) {
            return res.status(404).json({
                message: 'Role not found'
            })
        }
        //#endregion  //*======== Check role existence ===========

        //#region  //*=========== Update Roles labs ===========
        const rolesLabsRef = db.collection('Roles_labs').where('role_id', '==', roleRef)
        const rolesLabsSnapshot = await rolesLabsRef.get()
        const rolesLabsData = rolesLabsSnapshot.docs

        const promises = []
        access.map(acc => {
            const snapshot = rolesLabsData.find(rl => rl.data().lab_id.id === acc.lab_id)

            // if the record already exists, update it
            if (snapshot) {
                const roleLabRef = snapshot.ref
                promises.push(roleLabRef.update({
                    is_write: acc.is_write,
                    updated_at: new Date(),
                    updated_by: req.user_snapshot.ref
                }))
            }
            // if the record does not exist, create it
            else {
                promises.push(db.collection('Roles_labs').add({
                    role_id: roleRef,
                    lab_id: db.collection('Labs').doc(acc.lab_id),
                    is_write: acc.is_write,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: req.user_snapshot.ref,
                    updated_by: req.user_snapshot.ref
                }))
            
            }
        })

        await Promise.all(promises)
        //#endregion  //*======== Update Roles labs ===========

        res.status(200).json({
            message: 'Success'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}