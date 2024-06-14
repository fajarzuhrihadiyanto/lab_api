const db = require('../../db')

exports.getAllResearchController = async (req, res) => {
    try {
        const result = []

        //#region  //*=========== Parse request ===========
        const { lab_id } = req.query
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check lab existence ===========
        let labRef
        if (lab_id) {
            labRef = db.collection('Labs').doc(lab_id)
            const labSnapshot = await labRef.get()
            if (!labSnapshot.exists) {
                return res.status(404).json({
                    message: 'Lab not found'
                })
            }
        }
        //#endregion  //*======== Check lab existence ===========

        //#region  //*=========== Find research ===========
        let snapshot = db.collection('Research').orderBy("year", "desc");

        // optional parameter lab_id
        if (lab_id) snapshot = snapshot.where('lab_id', '==', labRef)

        snapshot = await snapshot.get();
        for (const doc of snapshot.docs) {
            
            //#region  //*=========== Get professor full name ===========
            let professorFullName
            if (doc.data().professor_id) {
                const professorData = await doc.data().professor_id.get()
                professorFullName = professorData.data().fullname
            }
            //#endregion  //*======== Get professor full name ===========

            result.push({
                id: doc.id,
                ...doc.data(),
                lab_id: doc.data().lab_id.id,
                professor_id: doc.data().professor_id?.id,
                professor_fullname: professorFullName,
                created_at: doc.data().created_at.toDate(),
                updated_at: doc.data().updated_at.toDate(),
                created_by: doc.data().created_by.id,
                updated_by: doc.data().updated_by.id,
            })
        }
        //#endregion  //*======== Find research ===========

        res.status(200).json({
            message: 'Success',
            data: {
                research: result
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}