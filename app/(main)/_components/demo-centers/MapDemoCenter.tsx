const MapDemoCenter = () => {
  return (
    <div>
      <div className="w-full rounded border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6511976.996234766!2d-124.59912455778917!3d37.16039652410438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sbd!4v1753912206530!5m2!1sen!2sbd"
          width="100%"
          height="500"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapDemoCenter;
