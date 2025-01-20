import express from "express";
import { deleteUser, getAllUsers, getSingleUser, Login, postUser, updateUser} from "../controllers/users";

const routes = express.Router();

// Define routes with RESTful conventions
routes.post("/register", postUser);
routes.post("/login", Login);
routes.get("/users", getAllUsers);
routes.get('/:id/user', getSingleUser);
routes.patch("/:id/user", updateUser);
routes.delete("/:id/user", deleteUser);

export default routes;
