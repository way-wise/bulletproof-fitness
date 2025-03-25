const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-white py-3 dark:bg-card">
      <div className="container">
        <p className="text-center">
          &copy;Copyright {new Date().getFullYear()} Company Name
        </p>
      </div>
    </footer>
  );
};

export default Footer;
