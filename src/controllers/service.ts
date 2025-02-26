import express from "express";
import { prisma } from "../util/connection";

export async function getAllServices(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const services = await prisma.service.findMany();
    if (services.length === 0) {
      res.status(404).json({ message: "No services found" });
      return;
    }
    if (services) {
      res.status(200).json({ message: "All services", data: services });
    }
    throw new Error("An error occured");
  } catch (error) {
    console.error("Error getting all services:", error);
  }
}

export async function getServiceById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }
    res.status(200).json({ message: "Service found", data: service });
  } catch (error) {
    console.error("Error getting service by ID:", error);
  }
}

//service category
export async function postServiceCategory(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ message: "Please fill all fields." });
      return;
    }
    const categoryExist = await prisma.serviceCategory.findFirst({
      where: { name },
    });
    if (categoryExist) {
      res.status(400).json({ message: "Category already exists." });
      return;
    }
    const category = await prisma.serviceCategory.create({
      data: {
        name,
        description,
      },
    });
    res
      .status(201)
      .json({ message: "Category created successfully", data: category });
    return;
  } catch (error) {
    next(error);
  }
}
export async function GetAllServiceCategory(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const categories = await prisma.serviceCategory.findMany();
    if (categories.length === 0) {
      res.status(404).json({ message: "No categories found." });
      return;
    }
    res.status(200).json({ message: "All categories", data: categories });
  } catch (error) {
    console.error("Error getting all categories:", error);
  }
}
export async function getServiceCategoryById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;
    const category = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category) {
      res.status(404).json({ message: "Category not found." });
      return;
    }
    res.status(200).json({ message: "Category found.", data: category });
  } catch (error) {
    console.error("Error getting category by ID:", error);
  }
}
export async function updateServiceCategory(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    console.log(req.body, "the submited")
    if (!name || !description) {
      res.status(400).json({ msg: "Please fill all fields" });
      return;
    }
    const categoryExist = await prisma.serviceCategory.findFirst({
      where: { id: parseInt(id) },
    });
    if (!categoryExist) {
      res.status(404).json({ msg: `Category id ${id} not found` });
      return;
    }
    const updatedCategory = await prisma.serviceCategory.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });
    console.log(updatedCategory, "the updated category");
    res
      .status(200)
      .json({ msg: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error." });  }
    return;
}
export async function deleteCategoryService(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;
    const category = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category) {
      res.status(404).json({ message: `Category id ${id} not found.` });
      return;
    }
    await prisma.serviceCategory.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}

//services

export async function postService(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { name, description, price, categoryId } = req.body;

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      res.status(400).json({ message: "Please fill all fields." });
      return;
    }

    // Validate `price` and `categoryId`
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      res
        .status(400)
        .json({ message: "Price must be a valid positive number." });
      return;
    }

    if (isNaN(parseInt(categoryId, 10))) {
      res.status(400).json({ message: "Category ID must be a valid number." });
      return;
    }

    // Ensure `categoryId` exists
    const categoryExists = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(categoryId, 10) },
    });

    if (!categoryExists) {
      res.status(400).json({ message: "Invalid category ID." });
      return;
    }

    // Check if the service already exists
    const serviceExist = await prisma.service.findFirst({
      where: { name },
    });

    if (serviceExist) {
      res.status(400).json({ message: "Service already exists." });
      return;
    }

    // Create the new service
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price), // Convert `price` to a float
        categoryId: parseInt(categoryId, 10), // Ensure `categoryId` is an integer
      },
    });

    // Respond with the newly created service
    res.status(201).json({
      message: "Service created successfully.",
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    next(error); // Pass the error to the custom error handler middleware
  }
}

export async function updateService(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    console.log(req.body, "the service");
    if (!name || !description || !price || !categoryId) {
      res.status(400).json({ message: "Please fill all fields." });
      return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      res
        .status(400)
        .json({ message: "Price must be a valid positive number." });
      return;
    }
    if (isNaN(parseInt(categoryId, 10))) {
      res.status(400).json({ message: "Category ID must be a valid number." });
      return;
    }
    const categoryExists = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(categoryId, 10) },
    });
    if (!categoryExists) {
      res.status(400).json({ message: "Invalid category ID." });
      return;
    }
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });
    if (!service) {
      res.status(404).json({ message: "Service not found." });
      return;
    }
    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        //status,
        price: parseFloat(price),
        categoryId: parseInt(categoryId, 10),
      },
    });
    res
      .status(200)
      .json({ message: "Service updated successfully.", data: updatedService });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error." });  }
}
export async function deleteService(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });
    if (!service) {
      res.status(404).json({ message: `Service id ${id} not found.` });
      return;
    }
    await prisma.service.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error deleting service:", error);
  }
}

//BOOKING SERVICE

export async function createBooking(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  //console.log(req.body, "the res---------------------");
  try {
    const { userId, serviceId, categoryId, bookedDate, description } = req.body;

    // Validate input
    if (!userId || !serviceId || !categoryId || !bookedDate) {
      res.status(400).json({ message: "Please provide all required fields." });
      return;
    }

    // Check if service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });
    if (!serviceExists) {
      res.status(404).json({ message: "Service not found." });
      return;
    }

    // Check if category exists
    const categoryExists = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found." });
      return;
    }

    // Create the booking
    const booking = await prisma.bookingService.create({
      data: {
        userId,
        serviceId,
        categoryId,
        bookedDate: new Date(bookedDate),
        description,
      },
    });

    res
      .status(201)
      .json({ message: "Booking created successfully.", data: booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    next(error);
  }
}
//getting all bookings
export async function getAllBookings(
  req: express.Request,
  res: express.Response
) {
  try {
    const bookings = await prisma.bookingService.findMany({
      include: {
        service: true,
        category: true,
        user: true,
        Payment: true,

      },
    });

    if (bookings.length === 0) {
      res.status(404).json({ message: "No bookings found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Bookings retrieved successfully.", data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}
//get bboking byid
export async function getBookingById(
  req: express.Request,
  res: express.Response
) {
  try {
    const { id } = req.params;

    const booking = await prisma.bookingService.findUnique({
      where: { id: parseInt(id) },
      include: {
        service: true,
        category: true,
        user: true,
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Booking retrieved successfully.", data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
  }
}
//update booking
export async function updateBooking(
  req: express.Request,
  res: express.Response
) {
  try {
    console.log(req.body, "the updated1;");
    const { id } = req.params;
    const { userId, serviceId, categoryId, bookedDate, description, status } = req.body;

    // Validate input
    if (!userId || !serviceId || !categoryId || !bookedDate) {
      res.status(400).json({ message: "Please provide all required fields." });
      return;
    }

    // Check if service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!serviceExists) {
      res.status(404).json({ message: "Service not found." });
      return;
    }

    // Check if category exists
    const categoryExists = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found." });
      return;
    }

    // Check if booking exists
    const bookingExists = await prisma.bookingService.findUnique({
      where: { id: parseInt(id) },
    });
    if (!bookingExists) {
      res.status(404).json({ message: "Booking not found." });
      return;
    }

    // Update the booking
    const updatedBooking = await prisma.bookingService.update({
      where: { id: parseInt(id) },
      data: {
        userId,
        serviceId,
        categoryId,
        status,
        bookedDate: new Date(bookedDate),
        description,
      },
    });

    res
      .status(200)
      .json({ message: "Booking updated successfully.", data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

///APPOINTMENT SERVICE
//has no data this should be deleted it was replace by the serivesbboked
// export async function getAppoints(req: express.Request, res: express.Response) {
//   try {
//     const appoint = await prisma.appointment.findMany();
//     if (appoint.length === 0) {
//       res.status(404).json({ msg: "You have No appointents" });
//       return;
//     }
//     if (appoint) {
//       res.status(200).json({ data: appoint });
//     }
//     throw new Error("Something went wrng");
//   } catch (error) {
//     res.status(404).json({ "Internal server error": error });
//     return;
//   }
// }

//update appointment
export async function updateAppointment(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction

) {
  const { id } = req.params;
  const { bookedDate, status } = req.body;
  console.log(req.body, "the appioint update");
  try {
    // Validate input
    if (!bookedDate || !status) {
      res.status(400).json({ message: "Please provide all required fields." });
      return;
    }

    // Update the appointment
    const updatedAppointment = await prisma.bookingService.update({
      where: { id: parseInt(id) },
      data: {
        bookedDate: new Date(bookedDate),
        status,
      },
    });

    res.status(200).json({
      message: "Appointment updated successfully.",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

//delete bookedserves only admin
export async function deleteBooked(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { id } = req.params;

  try {
    const serviceBooked = await prisma.bookingService.findUnique({
      where: { id: parseInt(id) },
    });
    if (!serviceBooked) {
      res.status(404).json({ msg: `the id ${id} does not exist` });
      return;
    }
    await prisma.bookingService.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(201)
      .json({
        msg: `Booked service id ${id} deleted seccessfully ${serviceBooked}`,
      });
    return;
  } catch (error) {
    res.status(500).json("Internal server error");
  }
}
