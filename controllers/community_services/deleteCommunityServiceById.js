const db = require('../../db')

exports.deleteCommunityServiceByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find community service ===========
        const reference = db.collection('Community_services').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Community service not found'
            })
        }
        //#endregion  //*======== Find community service ===========

        // Delete community service
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