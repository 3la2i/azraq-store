

const sectionClass = "bg-background text-primary-foreground p-8";
const headingClass = "text-3xl font-bold mb-4";
const textClass = "mb-4";
const subSectionClass = "grid grid-cols-1 md:grid-cols-2 gap-4";
const subHeadingClass = "text-xl font-bold mb-2";

const AboutUs = () => {
    return (
        <div className={sectionClass}>
            <h1 className={headingClass}>About Us</h1>
            <p className={textClass}>Welcome to our food delivery service! We are passionate about delivering delicious meals right to your doorstep.</p>
            <div className={subSectionClass}>
                <div>
                    <h2 className={subHeadingClass}>Our Mission</h2>
                    <p className={textClass}>Our mission is to provide convenient, fast, and high-quality food delivery services to our customers. We aim to satisfy your cravings with a wide variety of cuisines.</p>
                </div>
                <div>
                    <h2 className= {subHeadingClass}>Why Choose Us?</h2>
                    <p className={textClass}>With our easy-to-use platform, you can order your favorite meals with just a few clicks. We focus on timely deliveries and ensuring that your food arrives fresh and hot.</p>
                </div>
            </div>
            <img  src="https://t3.ftcdn.net/jpg/03/51/02/46/360_F_351024684_qRJBZa0XlvKs5bKDHVqlcbVF2ux4tDga.jpg" alt="About Us Image" className="mt-8 w-2/5 object-cover rounded-lg" />
        </div>
    );
};

export default AboutUs;
