import express from "express";
import { deleteUser, getAllUsers, getSingleUser, Login, postUser, updateUser} from "../controllers/users";
import { createBooking, deleteService, GetAllServiceCategory, getAllServices, getServiceById, postService, postServiceCategory, updateBooking, updateService } from "../controllers/service";

const routes = express.Router();

// Define routes with RESTful conventions
routes.post("/register", postUser);
routes.post("/login", Login);
routes.get("/users", getAllUsers);
routes.get('/:id/user', getSingleUser);
routes.patch("/:id/user", updateUser);
routes.delete("/:id/user", deleteUser);


//serivces routes

routes.get("/services", getAllServices);
routes.post('/service', postService);
routes.post('/serviceCategory', postServiceCategory);
routes.get("/serviceCategory", GetAllServiceCategory);
routes.get('/:id/service', getServiceById);
routes.patch('/:id/service', updateService);
routes.delete('/:id/service', deleteService);
//booking
routes.post('/booking', createBooking);
routes.patch("/:id/booking", updateBooking);

export default routes;
