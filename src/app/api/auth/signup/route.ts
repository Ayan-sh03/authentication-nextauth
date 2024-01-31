import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const hashedPassword = await hash(body.password, 10);

  

  const response = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      role: "user",
    },
  });

  console.log("Response "+response);
  const {password,...newUser} = response
  return NextResponse.json(
    { user: newUser, message: "User Created successfully" },
    { status: 201 }
  );
};
