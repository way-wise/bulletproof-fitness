import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-gray-700 py-3 dark:bg-card">
      <div className="container flex items-center justify-center gap-2 text-xs md:text-sm">
        <p className="text-center">
          &copy;Copyright {new Date().getFullYear()} Company Name
        </p>
        <p>|</p>
        <p className="text-center">
          <Link href="/" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
        <p>|</p>
        <p>
          <Link href="/" className="hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
