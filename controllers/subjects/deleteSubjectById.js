const db = require('../../db')

exports.deleteSubjectByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find subject ===========
        const reference = db.collection('Subjects').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Subject not found'
            })
        }
        //#endregion  //*======== Find subject ===========

        // Delete subject
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