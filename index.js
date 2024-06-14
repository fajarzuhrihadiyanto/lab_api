const cors = require('cors')
const express = require('express')

const dotenv = require('dotenv');
dotenv.config();

const { ACCESS_USER, ACCESS_ROLE, ACCESS_LABORATORY } = require('./constant')


const db = require('./db')

const roleValidationHandler = require('./middlewares/roleValidationHandler');
const validationErrorHandler = require('./middlewares/validationErrorHandler')

const { registerValidationHandlers, registerController } = require('./controllers/users/register')
const { loginValidationHandlers, loginController } = require('./controllers/users/login')

const { getAllUsersController } = require('./controllers/users/getAllUsers');
const { getUserByIdController } = require('./controllers/users/getUserById');
const { updateUserByIdController, updateUserByIdValidationHandlers } = require('./controllers/users/updateUserById');
const { deleteUserByIdController } = require('./controllers/users/deleteUserById');

const { getAllRolesController } = require('./controllers/roles/getAllRoles');
const { getRoleByIdController } = require('./controllers/roles/getRoleById');
const { addRoleValidationHandlers, addRoleController } = require('./controllers/roles/addRole');
const { updateRoleByIdController, updateRoleByIdValidationHandlers } = require('./controllers/roles/updateRoleById');
const { deleteRoleByIdController } = require('./controllers/roles/deleteRoleById');

const { getAllRolesLabsController } = require('./controllers/roles_labs/getAllRolesLabs');
const { getRoleLabByIdController } = require('./controllers/roles_labs/getRoleLabById');
const { addRoleLabValidationHandlers, addRoleLabController } = require('./controllers/roles_labs/addRoleLab');
const { updateRoleLabByIdValidationHandlers, updateRoleLabByIdController } = require('./controllers/roles_labs/updateRoleLabById');
const { deleteRoleLabByIdController } = require('./controllers/roles_labs/deleteRoleLabById');

const { getAllBooksController } = require('./controllers/books/getAllBooks');
const { getBookByIdController } = require('./controllers/books/getBookById');
const { addBookValidationHandlers, addBookController } = require('./controllers/books/addBook');
const { updateBookByIdValidationHandlers, updateBookByIdController } = require('./controllers/books/updateBookById');
const { deleteBookByIdController } = require('./controllers/books/deleteBookById');

const { getAllCommunityServicesController } = require('./controllers/community_services/getAllCommunityServices');
const { getCommunityServiceByIdController } = require('./controllers/community_services/getCommunityServiceById');
const { addCommunityServiceValidationHandlers, addCommunityServiceController } = require('./controllers/community_services/addCommunityService');
const { updateCommunityServiceByIdValidationHandlers, updateCommunityServiceByIdController } = require('./controllers/community_services/updateCommunityServiceById');
const { deleteCommunityServiceByIdController } = require('./controllers/community_services/deleteCommunityServiceById');

const {addFacilityController, addFacilityValidationHandlers} = require('./controllers/facilities/addFacility');
const {deleteFacilityByIdController} = require('./controllers/facilities/deleteFacilityById');
const {getFacilityByIdController} = require('./controllers/facilities/getFacilityById');
const {getAllFacilitiesController} = require('./controllers/facilities/getAllFacilities');
const {updateFacilityByIdController, updateFacilityByIdValidationHandlers} = require('./controllers/facilities/updateFacilityById');

const {addLabController, addLabValidationHandlers} = require('./controllers/labs/addLab');
const {deleteLabByIdController} = require('./controllers/labs/deleteLabById');
const {getLabByIdController} = require('./controllers/labs/getLabById');
const {getAllLabsController} = require('./controllers/labs/getAllLabs');
const {updateLabByIdController, updateLabByIdValidationHandlers} = require('./controllers/labs/updateLabById');

const {addProfessorController, addProfessorValidationHandlers} = require('./controllers/professors/addProfessor')
const {deleteProfessorByIdController} = require('./controllers/professors/deleteProfessorById')
const {getProfessorByIdController} = require('./controllers/professors/getProfessorById')
const {getAllProfessorsController} = require('./controllers/professors/getAllProfessors')
const {updateProfessorByIdController, updateProfessorByIdValidationHandlers} = require('./controllers/professors/updateProfessorById')

const { getAllResearchController } = require('./controllers/research/getAllResearch');
const { getResearchByIdController } = require('./controllers/research/getResearchById');
const { addResearchValidationHandlers, addResearchController } = require('./controllers/research/addResearch');
const { updateResearchByIdValidationHandlers, updateResearchByIdController } = require('./controllers/research/updateResearchById');
const { deleteResearchByIdController } = require('./controllers/research/deleteResearchById');

const { getAllSubjectsController } = require('./controllers/subjects/getAllSubjects');
const { getSubjectByIdController } = require('./controllers/subjects/getSubjectById');
const { addSubjectValidationHandlers, addSubjectController } = require('./controllers/subjects/addSubject');
const { updateSubjectByIdValidationHandlers, updateSubjectByIdController } = require('./controllers/subjects/updateSubjectById');
const { deleteSubjectByIdController } = require('./controllers/subjects/deleteSubjectById');



const app = express()

app.use(cors())
app.use(express.json())

// Authentication routes
app.post('/auth/login', ...loginValidationHandlers, validationErrorHandler, loginController)
app.post('/auth/register', roleValidationHandler('POST', ACCESS_USER), ...registerValidationHandlers, validationErrorHandler, registerController)

// User routes
app.get('/users',
    roleValidationHandler('GET', ACCESS_USER),
    getAllUsersController
)
app.get('/user/:id',
    roleValidationHandler('GET', ACCESS_USER),
    getUserByIdController
)
app.put('/user/:id',
    roleValidationHandler('PUT', ACCESS_USER),
    ...updateUserByIdValidationHandlers,
    validationErrorHandler,
    updateUserByIdController
)
app.delete('/user/:id',
    roleValidationHandler('DELETE', ACCESS_USER),
    deleteUserByIdController
)

// Role routes
app.get('/roles',
    roleValidationHandler('GET', ACCESS_ROLE),
    getAllRolesController
)
app.get('/role/:id',
    roleValidationHandler('GET', ACCESS_ROLE),
    getRoleByIdController
)
app.post('/role',
    roleValidationHandler('POST', ACCESS_ROLE),
    ...addRoleValidationHandlers,
    validationErrorHandler,
    addRoleController
)
app.put('/role/:id',
    roleValidationHandler('PUT', ACCESS_ROLE),
    ...updateRoleByIdValidationHandlers,
    validationErrorHandler,
    updateRoleByIdController
)
app.delete('/role/:id',
    roleValidationHandler('DELETE', ACCESS_ROLE),
    deleteRoleByIdController
)

// Role lab routes
app.get('/role_labs',
    roleValidationHandler('GET', ACCESS_ROLE),
    getAllRolesLabsController
)
app.get('/role_lab/:id',
    roleValidationHandler('GET', ACCESS_ROLE),
    getRoleLabByIdController
)
app.post('/role_lab',
    roleValidationHandler('POST', ACCESS_ROLE),
    ...addRoleLabValidationHandlers,
    validationErrorHandler,
    addRoleLabController
)
app.put('/role_lab/:id',
    roleValidationHandler('PUT', ACCESS_ROLE),
    ...updateRoleLabByIdValidationHandlers,
    validationErrorHandler,
    updateRoleLabByIdController
)
app.delete('/role_lab/:id',
    roleValidationHandler('DELETE', ACCESS_ROLE),
    deleteRoleLabByIdController
)

// Book routes
app.get('/books', getAllBooksController);
app.get('/book/:id', getBookByIdController);
app.post('/book', roleValidationHandler(), ...addBookValidationHandlers, validationErrorHandler, addBookController);
app.put('/book/:id', roleValidationHandler(), ...updateBookByIdValidationHandlers, validationErrorHandler, updateBookByIdController);
app.delete('/book/:id', roleValidationHandler(), deleteBookByIdController);

// Community service routes
app.get('/community_services', getAllCommunityServicesController);
app.get('/community_service/:id', getCommunityServiceByIdController);
app.post('/community_service', roleValidationHandler(), ...addCommunityServiceValidationHandlers, validationErrorHandler, addCommunityServiceController);
app.put('/community_service/:id', roleValidationHandler(), ...updateCommunityServiceByIdValidationHandlers, validationErrorHandler, updateCommunityServiceByIdController);
app.delete('/community_service/:id', roleValidationHandler(), deleteCommunityServiceByIdController);

// Facilities routes
app.get('/facilities', getAllFacilitiesController);
app.get('/facility/:id', getFacilityByIdController);
app.post('/facility', roleValidationHandler(), ...addFacilityValidationHandlers, validationErrorHandler, addFacilityController);
app.put('/facility/:id', roleValidationHandler(), ...updateFacilityByIdValidationHandlers, validationErrorHandler, updateFacilityByIdController);
app.delete('/facility/:id', roleValidationHandler(), deleteFacilityByIdController);

// Lab routes
app.get('/labs', getAllLabsController);
app.get('/lab/:id', getLabByIdController);
app.post('/lab', roleValidationHandler('POST', ACCESS_LABORATORY), ...addLabValidationHandlers, validationErrorHandler, addLabController);
app.put('/lab/:id', roleValidationHandler('PUT', ACCESS_LABORATORY), ...updateLabByIdValidationHandlers, validationErrorHandler, updateLabByIdController);
app.delete('/lab/:id', roleValidationHandler('DELETE', ACCESS_LABORATORY), deleteLabByIdController);

// Professor routes
app.get('/professors', getAllProfessorsController);
app.get('/professor/:id', getProfessorByIdController);
app.post('/professor', roleValidationHandler(), ...addProfessorValidationHandlers, validationErrorHandler, addProfessorController);
app.put('/professor/:id', roleValidationHandler(), ...updateProfessorByIdValidationHandlers, validationErrorHandler, updateProfessorByIdController);
app.delete('/professor/:id', roleValidationHandler(), deleteProfessorByIdController);

// Research routes
app.get('/research', getAllResearchController);
app.get('/research/:id', getResearchByIdController);
app.post('/research', roleValidationHandler(), ...addResearchValidationHandlers, validationErrorHandler, addResearchController);
app.put('/research/:id', roleValidationHandler(), ...updateResearchByIdValidationHandlers, validationErrorHandler, updateResearchByIdController);
app.delete('/research/:id', roleValidationHandler(), deleteResearchByIdController);

// Subject routes
app.get('/subjects', getAllSubjectsController);
app.get('/subject/:id', getSubjectByIdController);
app.post('/subject', roleValidationHandler(), ...addSubjectValidationHandlers, validationErrorHandler, addSubjectController);
app.put('/subject/:id', roleValidationHandler(), ...updateSubjectByIdValidationHandlers, validationErrorHandler, updateSubjectByIdController);
app.delete('/subject/:id', roleValidationHandler(), deleteSubjectByIdController);

app.get('/', async (req, res) => {
    try {
        // const role = await db.collection('Roles').doc('n8A3STdHDMj03Qzwk0AC');
        // const snapshot = await db.collection('Users').where('role_id', '==', role).get();
        // snapshot.forEach((doc) => {
        //   console.log(doc.id, '=>', {
        //     ...doc.data(),
        //     created_at: doc.data().created_at.toDate(),
        //     updated_at: doc.data().updated_at.toDate(),
        //     created_by: doc.data().created_by.id,
        //     updated_by: doc.data().updated_by.id,
        //     role_id: doc.data().role_id.id
        // });
        // });
    } catch (err) {
        console.log(err)
    }
    res.send('Hello World!')
})

app.listen(3000)