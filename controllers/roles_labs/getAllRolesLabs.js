const db = require('../../db')

exports.getAllRolesLabsController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { lab_id, role_id } = req.query
        //#endregion  //*======== Parse request ===========
        const result = []

        //#region  //*=========== Find roles labs ===========
        let query = db.collection('Roles_labs');

        // optional parameter lab_id
        if (lab_id) query = query.where('lab_id', '==', db.collection('Labs').doc(lab_id))

        // optional parameter role_id
        if (role_id) query = query.where('role_id', '==', db.collection('Roles').doc(role_id))

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            result.push({
                id: doc.id,
                ...doc.data(),
                lab_id: doc.data().lab_id.id,
                role_id: doc.data().role_id.id,
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