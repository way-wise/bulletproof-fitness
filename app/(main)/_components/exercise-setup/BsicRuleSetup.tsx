const BsicRuleSetup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-6">
        <h2 className="text-center text-2xl font-bold md:text-4xl">
          BASIC RULES TO SETUP
        </h2>
        <div className="mx-auto aspect-video w-full overflow-hidden rounded shadow-md">
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
      <div className="mx-auto mt-8 flex w-full flex-col items-center justify-center gap-6">
        <h2 className="text-center text-2xl font-bold md:text-4xl">
          ISOLATOR ASSEMBLY
        </h2>
        <div className="mx-auto aspect-video w-full overflow-hidden rounded shadow-md">
          <iframe
            className="size-full"
            src="https://www.youtube.com/embed/x7VRUJW8K6I"
            title="Basic Rules To ISOLATOR Setup"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default BsicRuleSetup;
