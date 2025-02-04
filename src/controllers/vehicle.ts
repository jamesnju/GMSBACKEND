import express from "express";
import { prisma } from "../util/connection";


export async function postVehicle(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { licensePlate, make, model, year, userId } = req.body;
    console.log(req.body, "car")
    if (!licensePlate || !make || !model || !year) {
      res.json({ msg: "All fileds required" });
      return;
    }

    const yearInt = parseInt(year, 10);
    const exstingvehicle = await prisma.vehicle.findFirst({
      where: {
        licensePlate,
      },
    });
    if (exstingvehicle) {
      res
        .status(401)
        .json({ msg: `Vehicle lincenselate ${licensePlate} exists` });
      return;
    }
    const car = await prisma.vehicle.create({
      data: {
        licensePlate,
        userId,
        //owner,
        make,
        model,
        year: yearInt,
      },
    });
    res.status(201).json({ msg: "success", data: car });
    return;
  } catch (error) {
    next(error);
  }
}

export async function getAllVehicle(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const vehicles = await prisma.vehicle.findMany();
    if (vehicles.length === 0) {
      res.status(404).json({ msg: "No vehicles available" });
      return;
    }
    if (vehicles) {
      res.status(200).json({ msg: "success", data: vehicles });
      return;
    }
  } catch (error) {
    next(error);
  }
}
