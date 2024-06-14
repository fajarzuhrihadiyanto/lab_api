const db = require('../../db')

exports.getUserByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find user ===========
        const snapshot = await db.collection('Users').doc(id).get();
        const data = snapshot.data()
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        //#endregion  //*======== Find user ===========

        // omit password from result
        const {password, ...result} = {
            id: snapshot.id,
            ...data,
            created_at: data.created_at.toDate(),
            updated_at: data.updated_at.toDate(),
            last_login: data.last_login.toDate(),
            created_by: data.created_by.id,
            updated_by: data.updated_by.id,
            role_id: data.role_id.id
        }

        res.status(200).json({
            message: 'Success',
            data: {
                user: result
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}