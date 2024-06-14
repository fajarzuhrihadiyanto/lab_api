const db = require('../../db')

exports.getAllRolesController = async (req, res) => {
    try {
        const result = []

        //#region  //*=========== Find role ===========
        const snapshot = await db.collection('Roles').get();
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
        //#endregion  //*======== Find role ===========

        res.status(200).json({
            message: 'Success',
            data: {
                roles: result
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}