const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Not working
// router.get('/api', async (req, res) => {
//     try {
//       // Read the JSON file
//       const data = fs.readFileSync('public/json.txt', 'utf8');

//       // Parse the JSON data
//       const jsonData = JSON.parse(data);

//       // Convert the JSON data to a string
//       const jsonString = JSON.stringify(jsonData);

//       // Encode the string as base64
//       const base64Data = Buffer.from(jsonString).toString('base64');

//       const url = 'http://localhost:3000?message=' + base64Data;

//       // Launch a headless browser
//       const browser = await puppeteer.launch({headless: true});

//       // Open a new page
//       const page = await browser.newPage();

//       // Navigate to the URL
//       await page.goto(url);

//       // Wait for some time to allow dynamic content to load (adjust as needed)
//       await page.waitForTimeout(5000);

//       // Get the sections of the page asynchronously
//       const sections = await page.evaluateAsync(async () => {
//         return Array.from(document.querySelectorAll('page'));
//       });

//       // Iterate over the sections and convert them to PDF
//       for (const section of sections) {
//         const pdf = await section.pdf({ format: 'A4' });
//         res.attachment(pdf);
//       }


//       // Close the browser
//       await browser.close();

//       // Send the PDF as a response
//       res.end("Hello");

//     } catch (error) {

//       console.error(error);
//       res.status(500).send('Internal Server Error');

//     }
//   });



//  Working --------------------------------------------------------------------------------------------------

// router.get('/api', async (req, res) => {
//   try {
//     // Read the JSON file
//     const data = fs.readFileSync('public/json.txt', 'utf8');
  const storage = multer.memoryStorage(); // Store file data in memory
  const upload = multer({ storage: storage });
router.post('/api', upload.single('data'),  async (req, res) => {
      try {

        if (!req.file) {
          res.status(400).send('No file uploaded');
          return;
        }
        const fileContentBuffer = req.file.buffer;
        const fileContent = fileContentBuffer.toString('utf8');


    const body = fileContent

    // Parse the JSON data
    const jsonData = JSON.parse(body);

    // Convert the JSON data to a string
    const jsonString = JSON.stringify(jsonData);

    // Encode the string as base64
    const base64Data = Buffer.from(jsonString).toString('base64');

    const url = 'http://localhost:3000?message=' + base64Data;
    console.log('File Content:', url);
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Wait for some time to allow dynamic content to load (adjust as needed)
    await page.waitForTimeout(5000);

    // Generate a PDF of the page
    const pdf = await page.pdf({ format: 'A4' });

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=page.pdf');
    res.send(pdf);
    await sendEmailWithAttachment(pdf);
  } catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');
  }

  async function sendEmailWithAttachment(pdfBuffer) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'gmail'
      auth: {
        user: 'jayashreehacharya97@gmail.com',
        pass: 'hdmtubpenwecsoqo',
      },
    });

    const mailOptions = {
      from: 'jayashreehacharya97@gmail.com',
      to: 'rupeshshetty243@gmail.com',
      subject: 'Subject of the Email',
      text: 'This is the plain text content of the email.',
      attachments: [
        {
            filename: 'invoice.pdf',
            content: pdfBuffer,
        },
    ],
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    }
});



//  Working --------------------------------------------------------------------

// router.get('/api', async(req, res) => {

//     try{

//         // Read the JSON file
//         const data = fs.readFileSync('public/json.txt', 'utf8');

//         // Parse the JSON data
//         const jsonData = JSON.parse(data);

//         // Convert the JSON data to a string
//         const jsonString = JSON.stringify(jsonData);

//         // Encode the string as base64
//         const base64Data = Buffer.from(jsonString).toString('base64');

//         const url = "http://localhost:3000?message=" + base64Data;

//         // Launch a headless browser
//         const browser = await puppeteer.launch();

//         // Create a new page
//         const page = await browser.newPage()

//         // Navigate to the URL
//         await page.goto(url);

//         // await page.waitForTimeout(2000);

//         await page.waitForSelector('page');

//         // Retrieve the HTML content of the page
//         // const htmlContent = await page.content();

//         const screenshot = await page.screenshot({ fullPage: true });

//         // Close the browser
//         await browser.close();

//         // Set the appropriate response headers to trigger a file download
//         res.setHeader('Content-disposition', 'attachment; filename=screenshot.png');
//         res.setHeader('Content-type', 'image/png');

//         res.send(screenshot)


//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching HTML content from the URL' });
//     }

// });


module.exports = router;





















    // router.get('/api', async(req, res) => {

    //     try{

    //         // Read the JSON file
    //         const data = fs.readFileSync('public/json.txt', 'utf8');

    //         // Parse the JSON data
    //         const jsonData = JSON.parse(data);

    //         // Convert the JSON data to a string
    //         const jsonString = JSON.stringify(jsonData);

    //         // Encode the string as base64
    //         const base64Data = Buffer.from(jsonString).toString('base64');

    //         const url = "http://localhost:3000?message=" + base64Data;

    //         // // Launch a headless browser
    //         const browser = await puppeteer.launch();

    //         // Create a new page
    //         const page = await browser.newPage()

    //         // Navigate to the URL
    //         await page.goto(url);

    //         await page.waitForTimeout(2000);

    //         // Capture the page as a PDF
    //         // const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, }); // You can specify the paper format and other options

    //         // Capture the page as a base64 image
    //         // const base64Image = await page.evaluate(() => {
    //         //     const element = document.body;
    //         //     return html2canvas(element).then(canvas => {
    //         //         return canvas.toDataURL('image/png');
    //         //     });
    //         // });

    //         // Retrieve the HTML content of the page
    //         const htmlContent = await page.content();

    //         // const screenshot = await page.screenshot({ fullPage: true });

    //         // Close the browser
    //         await browser.close();

    //         // Set the appropriate response headers to trigger a file download
    //         // res.setHeader('Content-disposition', 'attachment; filename=multi-page-screenshot.pdf');
    //         // res.setHeader('Content-type', 'application/pdf');

    //         // Set the appropriate response headers to trigger a file download
    //         // res.setHeader('Content-disposition', 'attachment; filename=screenshot.png');
    //         // res.setHeader('Content-type', 'image/png');

    //         // Set the appropriate response headers to trigger a file download
    //         // res.setHeader('Content-disposition', 'attachment; filename=multi-page-screenshot.png');
    //         // res.setHeader('Content-type', 'image/png');

    //         // res.send(htmlContent);
    //         // Send the captured screenshot as a file download
    //         // res.send(screenshot);
    //         // Send the multi-page screenshot as a file download
    //         // res.send(Buffer.from(base64Image, 'base64'));

    //         res.send(htmlContent);

    //     } catch (error) {
    //         res.status(500).json({ error: 'Error fetching HTML content from the URL' });
    //     }


    // // Read the JSON file
    // fs.readFile('public/json.txt', 'utf8', async (err, data) => {

    //     if (err) return res.status(500).json({ error: 'Error reading JSON file' });

    //     try {
    //         // Parse the JSON data
    //         const jsonData = JSON.parse(data);

    //         // Convert the JSON data to a string
    //         const jsonString = JSON.stringify(jsonData);

    //         // Encode the string as base64
    //         const base64Data = Buffer.from(jsonString).toString('base64');

    //         const url = "http://localhost:3000?message="+base64Data


    //         // Launch a headless browser
    //         const browser = await puppeteer.launch();

    //         // Create a new page
    //         const page = await browser.newPage();

    //         page.goto(url);

    //         // Send the HTML content as the response
    //         res.send(url);

    //     } catch (parseError) {
    //         res.status(400).json({ error: 'Invalid JSON format' });
    //     }
    // });
