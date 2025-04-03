"use server";

import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function handleSubmit(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/register");
  }

  const title = formData.get("title");
  const content = formData.get("content");
  const url = formData.get("url");

  await prisma.blogpOST.create({
    data: {
      title: title as string,
      content: content as string,
      imageUrl: url as string,
      authorId: user.id,
      authorImage: user.picture as string,
      authorName: user.given_name as string,
    },
  });

  revalidatePath("/");

  redirect("/dashboard");
}
