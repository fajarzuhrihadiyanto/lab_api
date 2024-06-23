const db = require('../../db')

exports.getAllUsersController = async (req, res) => {
    try {
        const result = []

        //#region  //*=========== Find user ===========
        const snapshot = await db.collection('Users').get();
        const rolePromises = []
        snapshot.forEach((doc) => {
            const data = doc.data()
            rolePromises.push(data.role_id.get())

            result.push({
                id: doc.id,
                ...doc.data(),
                password: undefined,
                last_login: doc.data().last_login.toDate(),
                created_at: doc.data().created_at.toDate(),
                updated_at: doc.data().updated_at.toDate(),
                created_by: doc.data().created_by.id,
                updated_by: doc.data().updated_by.id,
                role_id: doc.data().role_id.id
            })
        });

        const roles = await Promise.all(rolePromises)
        result.forEach((_, index) => {
            result[index].role_name = roles[index].data().name
        })
        //#endregion  //*======== Find user ===========

        res.status(200).json({
            message: 'Success',
            data: {
                users: result
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}