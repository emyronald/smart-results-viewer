import Menu from "@/components/menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex ">
      <div className="md:w-48 black-bg border-r border-gray-700 h-full fixed mt-16 z-1"><Menu/></div>
      <div className=" ml-10 flex-1 md:ml-48 mt-16">{children}</div>
    </div>
  );
}
