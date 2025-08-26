import { Toaster } from "@/components/ui/sonner";

const AdminLayout = ({ children }: any) => {
  return (
    <div className="flex h-screen w-screen items-center bg-neutral-900">
      <Toaster />
      <div className="h-full w-full p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
