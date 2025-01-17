import express from "express"
import { prisma } from "../util/connection";




export async function getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
        const users = await prisma.user.findMany();
        
        // If no users, return an empty array
        res.status(200).json(users || []);
    } catch (error) {
        next(error);  // Pass error to the next middleware
    }
}


export async function getSingleUser(req: express.Request, res: express.Response, next: express.NextFunction) {
   const id = parseInt(req.params.id);

   try {
      const user = await prisma.user.findUnique({
         where: {
            id: id
         }
      });

      if (!user) {
         const error = new Error(`User with ID ${id} does not exist`);
         return next(error); // Pass the error to the next middleware
      }

      res.status(200).json(user);
   } catch (error) {
      next(error); // If there's an error with the Prisma query, pass it to the next middleware
   }
}


export async function postUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        
        const { name, password, email } = req.body;

        if (!name || !email || !password) {
            const error = new Error("Fill all fields");
            return next(error);
        }

        const user = await prisma.user.create({
            data: { name, password, email },
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = parseInt(req.params.id);
    const { name, email, password, role } = req.body;
    try {
        // Find the user by ID
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        // If the user doesn't exist, return a 404 error
        if (!user) {
            const error = new Error(`User with ID ${id} not found`);
            res.status(400).json(`user id ${id} doesn't exist`);
            return next(error);
        }

        // Update the user data
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                name: name || user.name, // Only update the fields that are provided
                email: email || user.email,
                password: password || user.password,
                role: role || user.role,
            },
        });

        // Return the updated user
        res.status(201).json(updatedUser);
    } catch (error) {
        // Handle any errors
        console.error(error);
        next(error);
    }
}

export async function deleteUser(req: express.Request, res: express.Response, next: express.NextFunction){
    const id = parseInt(req.params.id);
    console.log(req.body);
    console.log(id, "the id")

    try {
        const user =  await prisma.user.findUnique({
            where :{
                id: id
            }          
        });
        if(!user){
            const error = new Error(`user id ${id} not found`);
            return next(error);
        }
        const userDeleted = await prisma.user.delete({
            where:{
                id: id
            }
        });
        res.status(200).json({message: `user id ${id} deleted succesfully`})
    } catch (error) {
        next(error);
        
    }
}


