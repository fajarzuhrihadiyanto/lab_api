const db = require('../../db')

exports.deleteUserByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find user ===========
        const reference = db.collection('Users').doc(id);
        const snapshot = await reference.get();
        const data = snapshot.data()
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        //#endregion  //*======== Find user ===========

        // Delete user
        await reference.delete()

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