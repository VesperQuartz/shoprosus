import Header from "@/components/navbar";

const ShopLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Header />
      {children}
    </div>
  );
};

export default ShopLayout;
