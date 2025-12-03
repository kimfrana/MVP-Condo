export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text border-t text-white border-zinc-700 px-6 py-4 flex items-center justify-center">
      <h4 className="text-sm font-semibold">
        &copy; {currentYear} Condo<span className="text-secondary">I</span>
        ntelligence. Todos os direitos reservados.
      </h4>
    </footer>
  );
};
