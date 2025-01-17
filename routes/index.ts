import express from "express";
import { deleteUser, getAllUsers, getSingleUser, postUser, updateUser} from "../controllers/users";

const routes = express.Router();

// Define routes with RESTful conventions
routes.post("/user", postUser);
routes.get("/users", getAllUsers);
routes.get('/:id/user', getSingleUser);
routes.patch("/:id/user", updateUser);
routes.delete("/:id/user", deleteUser);

export default routes;
