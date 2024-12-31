const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border py-4 dark:bg-slate-900">
      <div className="container">
        <p className="text-center">
          &copy;Copyright {new Date().getFullYear()} Company Name
        </p>
      </div>
    </footer>
  );
};

export default Footer;
