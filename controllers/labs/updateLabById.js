const { body, oneOf } = require('express-validator')

const db = require('../../db')

exports.updateLabByIdValidationHandlers = [
    oneOf([
        body('name')
            .notEmpty().withMessage('name cannot be empty'),
        body('alias')
            .notEmpty().withMessage('alias cannot be empty'),        
        body('general_information')
            .notEmpty().withMessage('general information cannot be empty'),
        body('website')
            .isString().withMessage('website must be a string'),
    ])
]

exports.updateLabByIdController = async (req, res) => {
    try {
        //#region  //*=========== Parse request ===========
        const { id } = req.params
        const { name, alias, website, general_information } = req.body
        //#endregion  //*======== Parse request ===========

        //#region  //*=========== Check lab existence ===========
        const reference = db.collection('Labs').doc(id);
        const snapshot = await reference.get();
        if (!snapshot.exists) {
            return res.status(404).json({
                message: 'Lab not found'
            })
        }
        const snapshotData = snapshot.data()
        //#endregion  //*======== Check lab existence ===========

        // Update lab
        const data = {
            name: name || snapshotData.name,
            alias: alias || snapshotData.alias,
            website: website || snapshotData.website,
            general_information: general_information || snapshotData.general_information,
            updated_at: new Date(),
            updated_by: req.user_snapshot.ref
        }
        await reference.update({...data})

        res.status(200).json({
            message: 'Success'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}