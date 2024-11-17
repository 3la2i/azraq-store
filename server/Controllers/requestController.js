const Request = require('../Models/Request');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and DOC files are allowed!'));
  }
}).single('resume');

exports.submitRequest = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, email, phoneNumber, message } = req.body;
      
      const requestData = {
        name,
        email,
        phoneNumber,
        message
      };

      if (req.file) {
        requestData.resume = `/uploads/resumes/${req.file.filename}`;
      }

      const request = new Request(requestData);
      await request.save();

      res.status(201).json({ 
        message: 'Request submitted successfully',
        request 
      });
    } catch (error) {
      console.error('Error saving request:', error);
      res.status(500).json({ 
        message: 'Error submitting request',
        error: error.message 
      });
    }
  });
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ submissionDate: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching requests',
      error: error.message 
    });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching request',
      error: error.message 
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.status(200).json({ 
      message: 'Request status updated successfully',
      request 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating request status',
      error: error.message 
    });
  }
}; 