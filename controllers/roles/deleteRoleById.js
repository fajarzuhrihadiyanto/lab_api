const db = require('../../db')

exports.deleteRoleByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find role ===========
        const reference = db.collection('Roles').doc(id);
        const snapshot = await reference.get();
        const data = snapshot.data()
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Role not found'
            })
        }
        //#endregion  //*======== Find role ===========

        // Delete role
        await reference.delete()

        //#region  //*=========== Delete related roles labs ===========
        const rolesLabsRef = db.collection('Roles_labs').where('role_id', '==', reference)
        const rolesLabsSnapshot = await rolesLabsRef.get()
        const rolesLabsData = rolesLabsSnapshot.docs
        const promises = []
        rolesLabsData.map(doc => {
            promises.push(doc.ref.delete())
        })
        await Promise.all(promises)
        //#endregion  //*======== Delete related roles labs ===========

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