const db = require('../../db')

exports.getAllRolesLabsController = async (req, res) => {
    try {
        const result = []

        //#region  //*=========== Find roles labs ===========
        const snapshot = await db.collection('Roles_labs').get();
        snapshot.forEach((doc) => {
            result.push({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at.toDate(),
                updated_at: doc.data().updated_at.toDate(),
                created_by: doc.data().created_by.id,
                updated_by: doc.data().updated_by.id,
            })
        });
        //#endregion  //*======== Find roles labs ===========

        res.status(200).json({
            message: 'Success',
            data: {
                roles_labs: result
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}