const db = require('../../db')

exports.getProfessorByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find professor ===========
        const snapshot = await db.collection('Professors').doc(id).get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Professor not found'
            })
        }
        const data = snapshot.data()
        //#endregion  //*======== Find professor ===========

        const result = {
            id: snapshot.id,
            ...data,
            lab_id: data.lab_id.id,
            created_at: data.created_at.toDate(),
            updated_at: data.updated_at.toDate(),
            created_by: data.created_by.id,
            updated_by: data.updated_by.id,
        }

        res.status(200).json({
            message: 'Success',
            data: {
                professor: result,
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}