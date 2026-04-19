const PageContainer = ({ children }) => {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-950 p-6 text-white">
      {children}
    </main>
  );
};

export default PageContainer;