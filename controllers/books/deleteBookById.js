const db = require('../../db')

exports.deleteBookByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find book ===========
        const reference = db.collection('Books').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Book not found'
            })
        }
        //#endregion  //*======== Find book ===========

        // Delete book
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