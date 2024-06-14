const db = require('../../db')

exports.deleteResearchByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find research ===========
        const reference = db.collection('Research').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Research not found'
            })
        }
        //#endregion  //*======== Find research ===========

        // Delete research
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