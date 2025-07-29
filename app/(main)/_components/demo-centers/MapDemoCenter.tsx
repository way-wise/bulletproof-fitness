const MapDemoCenter = () => {
  return (
    <div>
      <div className="w-full rounded border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58422.07957617063!2d90.34340608727314!3d23.769479936124384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7832a5d3f5d%3A0xfe8a8dfd796243e0!2sCalifornia%20Fried%20Chicken%20and%20Pastry%20Shop%20(CFC)%20Niketon!5e0!3m2!1sen!2sbd!4v1753806591665!5m2!1sen!2sbd"
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
