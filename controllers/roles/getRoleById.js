const db = require('../../db')

exports.getRoleByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find role ===========
        const snapshot = await db.collection('Roles').doc(id).get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Role not found'
            })
        }
        const data = snapshot.data()
        //#endregion  //*======== Find role ===========

        const result = {
            id: snapshot.id,
            ...data,
            created_at: data.created_at.toDate(),
            updated_at: data.updated_at.toDate(),
            created_by: data.created_by.id,
            updated_by: data.updated_by.id,
        }

        res.status(200).json({
            message: 'Success',
            data: {
                role: result,
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}