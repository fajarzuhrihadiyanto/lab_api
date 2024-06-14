const db = require('../../db')

exports.getResearchByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Find research ===========
        const snapshot = await db.collection('Research').doc(id).get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'research not found'
            })
        }
        const data = snapshot.data()
        //#endregion  //*======== Find research ===========

        const result = {
            id: snapshot.id,
            ...data,
            lab_id: data.lab_id.id,
            professor_id: data.professor_id.id,
            created_at: data.created_at.toDate(),
            updated_at: data.updated_at.toDate(),
            created_by: data.created_by.id,
            updated_by: data.updated_by.id,
        }

        res.status(200).json({
            message: 'Success',
            data: {
                research: result,
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}