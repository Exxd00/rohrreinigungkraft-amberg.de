import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ThankYouClient from "./ThankYouClient";

export default async function ThankYouPage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("kraft_thank_you_access");

  if (access?.value !== "granted") {
    redirect("/");
  }

  return <ThankYouClient />;
}
