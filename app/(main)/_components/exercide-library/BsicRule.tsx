const BsicRule = () => {
  return (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-6">
      <h2 className="text-center text-2xl font-bold md:text-4xl">
        BASIC RULES TO SETUP
      </h2>
      <div className="mx-auto aspect-video w-full overflow-hidden rounded md:w-1/2">
        <iframe
          className="size-full"
          src="https://www.youtube.com/embed/kt6MxpsAnY4"
          title="Basic Rules To ISOLATOR Setup"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default BsicRule;
