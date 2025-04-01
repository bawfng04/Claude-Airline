import inflight from "../../../assets/inflight-entertaining.jpg";
import comfortable from "../../../assets/comfortable-sitting.jpg";
import meal from "../../../assets/meal.webp";
import ServiceUnit from "./ServiceUnit";

const ServersSection = () => {
  return (
    <section className="homepage-section">
      <h2>Our Services</h2>
      <div className="services">
        <ServiceUnit
          img={inflight}
          title="Inflight Entertainment"
          description="Enjoy the latest movies, TV shows, and music."
        />
        <ServiceUnit
          img={comfortable}
          title="Comfortable Seating"
          description="Relax in our comfortable seats with extra legroom."
        />
        <ServiceUnit
          img={meal}
          title="Delicious Meals"
          description="Enjoy our delicious meals prepared by top chefs."
        />
      </div>
    </section>
  );
};

export default ServersSection;
