import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border py-3 dark:bg-card">
      <div className="container flex flex-col flex-wrap items-center justify-between gap-2 text-xs sm:flex-row md:text-sm">
        <p className="text-center">
          &copy;Copyright {new Date().getFullYear()} bulletprooffitness
        </p>

        <p className="text-center">
          <Link href="/privacy-policy" className="mr-4 hover:underline">
            Privacy Policy
          </Link>

          <Link href="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
