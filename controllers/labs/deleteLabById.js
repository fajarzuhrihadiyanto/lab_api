const db = require('../../db')

exports.deleteLabByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find lab ===========
        const reference = db.collection('Labs').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Lab not found'
            })
        }
        //#endregion  //*======== Find lab ===========

        // Delete lab
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