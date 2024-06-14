const db = require('../../db')

exports.getAllLabsController = async (req, res) => {
    try {
        const result = []

        //#region  //*=========== Find lab ===========
        const snapshot = await db.collection('Labs').get();
        snapshot.forEach((doc) => {
            result.push({
                id: doc.id,
                ...doc.data(),
                head_lab_id: doc.data().head_lab_id.id,
                created_at: doc.data().created_at.toDate(),
                updated_at: doc.data().updated_at.toDate(),
                created_by: doc.data().created_by.id,
                updated_by: doc.data().updated_by.id,
            })
        });
        //#endregion  //*======== Find lab ===========

        res.status(200).json({
            message: 'Success',
            data: {
                labs: result
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}