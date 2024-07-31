const inputClasses = "w-full px-3 py-2 mt-1 rounded-md border focus:outline-none focus:ring focus:ring-primary";
const buttonClasses = "bg-tomato text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 focus:outline-none focus:ring focus:ring-ring";

const ContactUs = () => {
    return (
        <div className="bg-background text-primary-foreground min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-center text-lg mb-8">Reach out to us for any inquiries or feedback!</p>
            <div className="flex flex-row items-start justify-center w-full max-w-5xl">
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-2xl w-full">
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
                            <input type="text" id="name" name="name" placeholder="John Doe" className={inputClasses} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium">Your Email</label>
                            <input type="email" id="email" name="email" placeholder="john.doe@example.com" className={inputClasses} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-sm font-medium">Message</label>
                            <textarea id="message" name="message" rows="4" placeholder="Your message here..." className={inputClasses}></textarea>
                        </div>
                        <button type="submit" className={buttonClasses}>Submit</button>
                    </form>
                </div>
                <img className="w-96 ml-8" src="https://firebasestorage.googleapis.com/v0/b/la2project-4d60e.appspot.com/o/contactimg%2Ffor%20contact.png?alt=media&token=ca3bcc9a-da6b-410f-bcfd-9ed8052684eb" alt="Contact Us" />
            </div>
        </div>
    );
};

export default ContactUs;
