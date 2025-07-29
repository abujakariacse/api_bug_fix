import Banner from "../../components/Banner";
import Featured from "../../components/Featured";
import About from "../../components/About";
import Newsletter from "../../components/Newsletter";
import FeaturedClasses from "../../components/FeaturedClasses";
import Team from "../../components/Team";
import ReviewsCarousel from "../ReviewsCarousel/ReviewsCarousel";
import ForumHome from "../../components/ForumHome";
import CustomHelmet from "../../Shared/CustomHelmet";

const Home = () => {
  return (
    <div>
      <CustomHelmet
        title="FitForge - Home"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <Banner></Banner>
      <Featured></Featured>
      <FeaturedClasses></FeaturedClasses>
      <About></About>
      <ForumHome></ForumHome>
      <Newsletter></Newsletter>
      <Team></Team>
      <ReviewsCarousel></ReviewsCarousel>
    </div>
  );
};

export default Home;
