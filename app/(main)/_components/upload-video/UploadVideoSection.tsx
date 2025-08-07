"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const UploadVideoSection = () => {
  return (
    <div className="container py-12">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-12 transition-all duration-500 ease-in-out md:w-3/4 md:flex-row">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/exercise-setup.webp"
            alt="Setup Upload Video"
            className="w-full"
            width={300}
            height={200}
          />
          <Link href="/upload-video/exercise-setup">
            <Button className="mt-2 cursor-pointer rounded-sm uppercase">
              UPLOAD EXERCISE SETUP VIDEO
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/exercise-library.webp"
            alt="Exercise Library"
            className="w-full"
            width={300}
            height={200}
          />

          <Link href="/upload-video/exercise-library">
            <Button className="mt-2 cursor-pointer rounded-sm uppercase">
              UPLOAD EXERCISE LIBRARY VIDEO
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoSection;
