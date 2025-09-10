import { getBusinessDetails } from "@/lib/data";

export default async function ContactUs() {
  await getBusinessDetails();
  return <></>;
}
