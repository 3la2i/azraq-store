const Testimonial = require('../Models/testimonial');

exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({ message: 'Testimonial submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
};

exports.getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();
    
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle testimonial status' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

exports.checkTestimonialStatus = async (req, res) => {
  try {
    const allTestimonials = await Testimonial.find();
    const active = await Testimonial.find({ isActive: true });

    res.json({
      total: allTestimonials.length,
      active: active.length,
      testimonials: allTestimonials
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check testimonial status' });
  }
}; 