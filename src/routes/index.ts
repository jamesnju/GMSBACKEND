import express from "express";
import { deleteUser, getAllUsers, getSingleUser, Login, postUser, updateUser} from "../controllers/users";
import { createBooking, deleteBooked, deleteCategoryService, deleteService, getAllBookings, GetAllServiceCategory, getAllServices, getBookingById, getServiceById, getServiceCategoryById, postService, postServiceCategory,  updateAppointment,  updateBooking, updateService, updateServiceCategory } from "../controllers/service";
import { deleteVehicle, getAllVehicle, postVehicle, updateVehicle } from "../controllers/vehicle";
import { createPayment, getAllPayments } from "../controllers/payments";
import {mpesaWebhook, payMpesa} from "../controllers/mpesa";
import { systemReport } from "../controllers/report";

const routes = express.Router();

// Define routes with RESTful conventions
routes.post("/register", postUser);
routes.post("/login", Login);
routes.get("/users", getAllUsers);
routes.get('/:id/user', getSingleUser);
routes.patch("/:id/user", updateUser);
routes.delete("/:id/user", deleteUser);

//service category
routes.post('/serviceCategory', postServiceCategory);
routes.get("/serviceCategory", GetAllServiceCategory);
routes.get("/:id/serviceCategory", getServiceCategoryById);
routes.patch("/:id/serviceCategory", updateServiceCategory);
routes.delete("/:id/serviceCategory", deleteCategoryService);
//serivces routes

routes.get("/services", getAllServices);
routes.post('/service', postService);
routes.get('/:id/service', getServiceById);
routes.patch('/:id/service', updateService);
routes.delete('/:id/service', deleteService);
//booking
routes.post('/booking', createBooking);
routes.get('/:id/booking', getBookingById);
routes.patch("/:id/booking", updateBooking);
routes.get('/bookings', getAllBookings);


//appointment i used the booking service table
routes.patch("/:id/appointment", updateAppointment);
//routes.get("/appointments", getAppoints);
routes.delete("/:id/appointment", deleteBooked)

//VEHICLE ROUTES
routes.post("/vehicle", postVehicle);
routes.get("/vehicles", getAllVehicle);
routes.patch("/:id/vehicle", updateVehicle);
routes.delete("/:id/vehicle", deleteVehicle);

//payments stripe
routes.post("/payments", createPayment);
// routes.post("/verifystripewebhk", stripeWebhook);
routes.get("/payments", getAllPayments);

//mpesa
routes.post("/mpesa", payMpesa);
routes.post("/mpesawebhook", mpesaWebhook);

//report
routes.get("/report", systemReport);

export default routes;
